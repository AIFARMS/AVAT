import { WebCodecsFrameSource } from './webcodecs_frame_source';

const frameSources = new Map();

export async function loadFrameSource(streamNum, file) {
  const existingSource = frameSources.get(streamNum);
  existingSource?.destroy();

  const frameSource = new WebCodecsFrameSource();
  await frameSource.load(file);
  frameSources.set(streamNum, frameSource);
  return frameSource;
}

export function getFrameSource(streamNum) {
  return frameSources.get(streamNum);
}

export function clearFrameSources() {
  for (const frameSource of frameSources.values()) {
    frameSource.destroy();
  }
  frameSources.clear();
}
