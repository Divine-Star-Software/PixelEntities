import type { PixelEntityData, PixelEntityIndexData, PixelEntityKeyFrameData } from "Types/PixelEntityData.types";
import type { Vec3Array } from "divine-voxel-engine/Math";
import { Flat3DAnyArray } from "divine-voxel-engine/Tools/Util/Flat3dArray.js";
export declare class AnimatedPixelEntity {
    data: PixelEntityData;
    id: string;
    pixelIndex: Flat3DAnyArray<PixelEntityIndexData>;
    matrix: Float32Array;
    animation: {
        animation: string;
        count: number;
        keyFrameTime: number;
        frameIndex: number;
        maxFrameIndex: number;
        frameOrder: number[];
    };
    nextFrame: Flat3DAnyArray<[displacment: Vec3Array]>;
    currentFrame: Flat3DAnyArray<[displacment: Vec3Array]>;
    processedKeyFrames: Record<string, Flat3DAnyArray<[displacment: Vec3Array]>[]>;
    constructor(data: PixelEntityData, id?: string);
    _getPercentTillNextFrame(): number;
    _runAnimationTick(): false | undefined;
    _zeroVec3: Vec3Array;
    lerpFrames(start: Flat3DAnyArray<[displacment: Vec3Array]>, end: Flat3DAnyArray<[displacment: Vec3Array]>, percent: number): void;
    setAnimation(id: string): void;
    getAnimationData(id: string): {
        frameOrder: number[];
        keyFrames: PixelEntityKeyFrameData[];
    };
    getAnimationKeyFrame(id: string, frame: number): Flat3DAnyArray<[displacment: Vec3Array]>;
    getPixelData(x: number, y: number, z: number): false | PixelEntityIndexData;
    getPixelPosition(x: number, y: number, z: number): false | Vec3Array;
    getPixelOriginalPosition(x: number, y: number, z: number): false | Vec3Array;
    getPixelMatrixIndex(x: number, y: number, z: number): number | false;
    updatePixelPosition([x, y, z]: Vec3Array, [nx, ny, nz]: Vec3Array): void;
}
