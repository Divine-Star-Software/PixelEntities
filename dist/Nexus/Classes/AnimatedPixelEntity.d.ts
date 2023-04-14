import type { PixelEntityIndexData, ProcessedEntityData } from "Types/PixelEntityData.types";
import type { Vec3Array } from "divine-voxel-engine/Math";
import { Flat3DAnyArray } from "divine-voxel-engine/Tools/Util/Flat3dArray.js";
import { LocationData } from "voxelspaces";
import { AnimatedPixelEntityType } from "./AnimatedPixelEntityType.js";
export declare class AnimatedPixelEntity {
    location: LocationData;
    data: ProcessedEntityData;
    id: string;
    matrix: Float32Array;
    voxelData: Float32Array;
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
    pixelFlatIndex: Flat3DAnyArray<PixelEntityIndexData>;
    type: AnimatedPixelEntityType;
    lightMap: Flat3DAnyArray<{
        voxelPosition: Vec3Array;
    }>;
    constructor(location: LocationData, data: ProcessedEntityData, id?: string);
    _getPercentTillNextFrame(): number;
    _runAnimationTick(): false | undefined;
    _start: Vec3Array;
    _end: Vec3Array;
    _final: Vec3Array;
    _zeroVec3: Vec3Array;
    update([x, y, z]: Vec3Array, ogPositon: Vec3Array): void;
    setAnimation(id: string): void;
    updatePixelPosition([x, y, z]: Vec3Array, [nx, ny, nz]: Vec3Array): void;
}
