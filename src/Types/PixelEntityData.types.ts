import type { Vec3Array } from "divine-voxel-engine/Math/";
export type PixelEntityData = {
  size: Vec3Array;
  pixels: Record<
    string,
    {
      color: Vec3Array;
    }
  >;
  layers: {
    height: number;
    matrix: (string | number)[][];
  }[];
  startingAnimation: string;
  animations: PixelEntityAnimationData;
};

export type PixelEntityIndexData = {
  originalPosition: Vec3Array;
  position: Vec3Array;
  matrixIndex: number;
};

export type PixelEntityAnimationData = Record<
  string,
  {
    frameOrder: number[];
    keyFrames: PixelEntityKeyFrameData[];
  }
>;

export type PixelEntityKeyFrameData = {
  length: number;
  pixels: [
    pixelRange: [start: Vec3Array, end: Vec3Array],
    displacment: Vec3Array
  ][];
};
