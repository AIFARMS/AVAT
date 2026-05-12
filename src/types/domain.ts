export type MediaType = 'in_image' | 'in_video';

export type AnnotationToolId = '1' | '2' | '3' | '4';

export type VideoMetadata = {
  horizontal_res: number;
  vertical_res: number;
  frame_rate: number;
  media_type: MediaType | string;
  total_frames: number;
  skip_value: number;
  playback_speed: number;
  name?: string;
};

export type Point = {
  x: number;
  y: number;
};

export type BoundingBoxExportAnnotation = {
  type: 'bounding_box';
  x: number;
  y: number;
  width: number;
  height: number;
  local_id: string | number;
  dataType?: 'image' | 'video';
  fileName?: string;
  'fileName:'?: string;
};

export type SegmentationExportAnnotation = {
  type: 'segmentation';
  points: Point[];
  local_id: string | number;
  dataType?: 'image' | 'video';
  fileName?: string;
  'fileName:'?: string;
};

export type FrameExportAnnotation = BoundingBoxExportAnnotation | SegmentationExportAnnotation;

export type CellValue = string | number | boolean | null | undefined;

export type BehaviorRow = {
  id: string;
} & Record<string, CellValue>;

export type SelectOption = {
  value: string;
} & Record<string, unknown>;

export type SelectData = Record<string, SelectOption[]>;

export type ColumnConfig = {
  columns: unknown[];
  select_data?: SelectData;
};

export type AutosaveSession = {
  id: 'active';
  schemaVersion: 1;
  updatedAt: string;
  projectName: string;
  annotationType: string;
  boxCount: number;
  currentFrame: number;
  metadata: VideoMetadata;
  columnData: ColumnConfig | null;
  mediaData: unknown[];
  annotationJson: {
    vid_metadata: VideoMetadata;
    annotations: unknown;
    behavior_data: BehaviorRow[][];
  };
};

export type FrameSource = {
  width: number;
  height: number;
  totalFrames: number;
  averageFrameRate: number | null;
  load(file: File): Promise<void>;
  getFrame(frameIndex: number): Promise<ImageBitmap>;
  prefetchAround(frameIndex: number, radius?: number): void;
  destroy(): void;
};
