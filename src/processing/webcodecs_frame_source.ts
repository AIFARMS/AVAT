import { createFile, DataStream } from 'mp4box';

const MICROSECONDS_PER_SECOND = 1000000;

function timeToMicroseconds(value, timescale) {
  return Math.round((value / timescale) * MICROSECONDS_PER_SECOND);
}

function getDecoderDescription(sampleDescription) {
  const configBox = sampleDescription?.avcC || sampleDescription?.hvcC || sampleDescription?.av1C || sampleDescription?.vpcC;
  if (!configBox?.write) {
    return undefined;
  }

  const stream = new DataStream(undefined, 0, 1);
  configBox.write(stream);
  return stream.buffer.slice(8);
}

function readMp4Info(file) {
  return new Promise<any>(async (resolve, reject) => {
    const mp4boxFile = createFile(false);
    let parsedInfo = null;

    mp4boxFile.onError = (_module, message) => reject(new Error(message));
    mp4boxFile.onReady = (info) => {
      parsedInfo = info;
    };

    try {
      const chunkSize = 1024 * 1024;
      for (let offset = 0; offset < file.size; offset += chunkSize) {
        const end = Math.min(offset + chunkSize, file.size);
        const buffer = await file.slice(offset, end).arrayBuffer();
        buffer.fileStart = offset;
        mp4boxFile.appendBuffer(buffer);
      }
      mp4boxFile.flush();

      if (!parsedInfo) {
        reject(new Error('Unable to parse MP4 metadata.'));
        return;
      }

      resolve({ mp4boxFile, info: parsedInfo });
    } catch (error) {
      reject(error);
    }
  });
}

export class WebCodecsFrameSource {
  [key: string]: any;

  constructor({ cacheSize = 15 } = {}) {
    this.cacheSize = cacheSize;
    this.cache = new Map();
    this.pending = new Map();
    this.prefetching = new Set();
    this.file = null;
    this.track = null;
    this.samples = [];
    this.displaySamples = [];
    this.config = null;
    this.totalFrames = 0;
    this.width = 0;
    this.height = 0;
    this.averageFrameRate = null;
  }

  async load(file) {
    if (!('VideoDecoder' in window) || !('EncodedVideoChunk' in window)) {
      throw new Error('This browser does not support WebCodecs video decoding. Use a current Chromium-based browser.');
    }

    this.file = file;
    const { mp4boxFile, info } = await readMp4Info(file);
    const track = info.videoTracks?.[0];
    if (!track) {
      throw new Error('No video track found in the uploaded MP4.');
    }

    const samples = mp4boxFile.getTrackSamplesInfo(track.id);
    if (!samples?.length) {
      throw new Error('No video samples found in the uploaded MP4.');
    }

    this.track = track;
    this.samples = samples.map((sample, decodeIndex) => ({ ...sample, decodeIndex }));
    this.displaySamples = [...this.samples].sort((a, b) => {
      const timeDiff = (a.cts ?? a.dts) - (b.cts ?? b.dts);
      return timeDiff === 0 ? a.number - b.number : timeDiff;
    });
    this.totalFrames = this.displaySamples.length;
    this.width = track.video?.width || track.track_width;
    this.height = track.video?.height || track.track_height;
    this.averageFrameRate = track.duration ? this.totalFrames / (track.duration / track.timescale) : null;

    this.config = {
      codec: track.codec,
      codedWidth: this.width,
      codedHeight: this.height,
      description: getDecoderDescription(this.samples[0].description),
    };

    const support = await VideoDecoder.isConfigSupported(this.config);
    if (!support.supported) {
      throw new Error(`Unsupported video codec for WebCodecs: ${track.codec}`);
    }
  }

  async getFrame(frameIndex) {
    if (this.cache.has(frameIndex)) {
      const bitmap = this.cache.get(frameIndex);
      this.cache.delete(frameIndex);
      this.cache.set(frameIndex, bitmap);
      return bitmap;
    }

    if (this.pending.has(frameIndex)) {
      return this.pending.get(frameIndex);
    }

    const pending = this.decodeFrame(frameIndex)
      .then((bitmap) => {
        this.cacheFrame(frameIndex, bitmap);
        return bitmap;
      })
      .finally(() => this.pending.delete(frameIndex));

    this.pending.set(frameIndex, pending);
    return pending;
  }

  prefetchAround(frameIndex, radius = 2) {
    for (let offset = 1; offset <= radius; offset++) {
      this.prefetch(frameIndex + offset);
      this.prefetch(frameIndex - offset);
    }
  }

  destroy() {
    for (const bitmap of this.cache.values()) {
      bitmap.close?.();
    }
    this.cache.clear();
    this.pending.clear();
    this.prefetching.clear();
  }

  prefetch(frameIndex) {
    if (frameIndex < 0 || frameIndex >= this.totalFrames || this.cache.has(frameIndex) || this.prefetching.has(frameIndex)) {
      return;
    }

    this.prefetching.add(frameIndex);
    this.getFrame(frameIndex).catch(() => {}).finally(() => this.prefetching.delete(frameIndex));
  }

  cacheFrame(frameIndex, bitmap) {
    this.cache.set(frameIndex, bitmap);

    while (this.cache.size > this.cacheSize) {
      const oldestKey = this.cache.keys().next().value;
      const oldestBitmap = this.cache.get(oldestKey);
      this.cache.delete(oldestKey);
      oldestBitmap?.close?.();
    }
  }

  async decodeFrame(frameIndex) {
    if (frameIndex < 0 || frameIndex >= this.totalFrames) {
      throw new Error(`Frame index ${frameIndex} is outside the video range.`);
    }

    const targetSample = this.displaySamples[frameIndex];
    const targetTimestamp = timeToMicroseconds(targetSample.cts ?? targetSample.dts, targetSample.timescale);
    const startIndex = this.findKeyframeIndex(targetSample.decodeIndex);
    const endIndex = this.findDecodeEndIndex(targetSample.decodeIndex);
    let bitmap = null;
    let decoderError = null;
    const outputTasks = [];

    const decoder = new VideoDecoder({
      output: (frame) => {
        if (frame.timestamp === targetTimestamp && !bitmap) {
          const task = createImageBitmap(frame)
            .then((createdBitmap) => {
              bitmap = createdBitmap;
            })
            .finally(() => frame.close());
          outputTasks.push(task);
        } else {
          frame.close();
        }
      },
      error: (error) => {
        decoderError = error;
      },
    });

    decoder.configure(this.config);

    for (let index = startIndex; index <= endIndex; index++) {
      const sample = this.samples[index];
      const data = await this.readSampleData(sample);
      const chunk = new EncodedVideoChunk({
        type: sample.is_sync ? 'key' : 'delta',
        timestamp: timeToMicroseconds(sample.cts ?? sample.dts, sample.timescale),
        duration: timeToMicroseconds(sample.duration, sample.timescale),
        data,
      });

      decoder.decode(chunk);

      if (decoder.decodeQueueSize > 16) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    await decoder.flush();
    await Promise.all(outputTasks);
    decoder.close();

    if (decoderError) {
      throw decoderError;
    }

    if (!bitmap) {
      throw new Error(`Unable to decode frame ${frameIndex}.`);
    }

    return bitmap;
  }

  findKeyframeIndex(decodeIndex) {
    for (let index = decodeIndex; index >= 0; index--) {
      if (this.samples[index].is_sync) {
        return index;
      }
    }
    return 0;
  }

  findDecodeEndIndex(decodeIndex) {
    for (let index = decodeIndex + 1; index < this.samples.length; index++) {
      if (this.samples[index].is_sync) {
        return index - 1;
      }
    }
    return this.samples.length - 1;
  }

  async readSampleData(sample) {
    const buffer = await this.file.slice(sample.offset, sample.offset + sample.size).arrayBuffer();
    return new Uint8Array(buffer);
  }
}
