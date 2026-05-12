import type { fabric } from 'fabric';

declare module 'fabric' {
  namespace fabric {
    interface Object {
      local_id?: string | number;
      edit?: boolean;
      id?: string | number;
      zindex?: number;
      line1?: Line;
      line2?: Line;
      line3?: Line;
      line4?: Line;
      _objects?: Object[];
      objects?: Object[];
      __corner?: string;
    }

    interface Canvas {
      isDragging?: boolean;
      objDrag?: boolean;
      lastPosX?: number;
      lastPosY?: number;
    }

    interface Control {
      pointIndex?: number;
    }
  }
}

export type ExtendedFabricObject = fabric.Object & {
  local_id?: string | number;
  _objects?: fabric.Object[];
  objects?: fabric.Object[];
};

export type ExtendedFabricGroup = fabric.Group & {
  local_id?: string | number;
  _objects?: fabric.Object[];
  objects?: fabric.Object[];
};
