declare module 'mediainfo.js' {
  const MediaInfo: any;
  export default MediaInfo;
}

declare module 'react-test-renderer' {
  const renderer: any;
  export default renderer;
}

declare module '@testing-library/jest-dom/extend-expect' {}

declare module 'mp4box' {
  export class DataStream {
    constructor(buffer?: unknown, byteOffset?: number, endianness?: unknown);
    static BIG_ENDIAN: boolean;
    buffer: ArrayBuffer;
  }

  export function createFile(_keepMdatData?: boolean): {
    onError?: (...args: any[]) => void;
    onReady?: (info: unknown) => void;
    onSamples?: (trackId: number, user: unknown, samples: unknown[]) => void;
    appendBuffer(buffer: ArrayBuffer & { fileStart?: number }): number;
    flush(): void;
    getTrackSamplesInfo(trackId: number): any[];
    setExtractionOptions(trackId: number, user?: unknown, options?: { nbSamples?: number }): void;
    start(): void;
    stop(): void;
  };
}

type EncodedVideoChunkInitLike = EncodedVideoChunkInit & {
  duration?: number;
};
