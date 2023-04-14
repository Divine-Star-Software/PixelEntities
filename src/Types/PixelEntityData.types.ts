import { ConstructorTextureData } from "divine-voxel-engine";
import type { Vec3Array } from "divine-voxel-engine/Math/";
export type PixelEntityData = {
  size: Vec3Array;
  id : string;
  textures: Record<string, ConstructorTextureData>;

  segments : Record<string,
  PixelEntitySegmentData
  >

  startingAnimation: string;
  animations: PixelEntityAnimationData;
};

export type PixelEntitySegmentData = {
  offset : Vec3Array;
  pixels: Record<
    string,
    {
      texture: string;
      color: Vec3Array;
    }
  >;
  layers: {
    height: number;
    matrix: (string | number)[][];
  }[];
}

export type ProcessedEntityData = PixelEntityData & {
  textureMap : Record<string,number>
}

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
