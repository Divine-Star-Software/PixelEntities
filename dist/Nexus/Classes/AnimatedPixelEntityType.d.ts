import type { PixelEntityIndexData, ProcessedEntityData } from "Types/PixelEntityData.types";
import type { Vec3Array } from "divine-voxel-engine/Math";
import { AnimatedPixelEntity } from "./AnimatedPixelEntity.js";
import { Flat3DAnyArray } from "divine-voxel-engine/Tools/Util/Flat3dArray.js";
export declare class AnimatedPixelEntityType {
    data: ProcessedEntityData;
    pixelIndex: Vec3Array[];
    pixelFlatIndex: Flat3DAnyArray<PixelEntityIndexData>;
    matrix: number[];
    voxelData: number[];
    entities: Set<AnimatedPixelEntity>;
    entitiesIndex: Map<string, AnimatedPixelEntity>;
    _arrayToSAB(data: number[], byteSize?: number): Float32Array;
    processedKeyFrames: Record<string, Flat3DAnyArray<[displacment: Vec3Array]>[]>;
    getLightMap(): Flat3DAnyArray<{
        voxelPosition: Vec3Array;
    }>;
    getInstanceData(): Float32Array[];
    constructor(data: ProcessedEntityData);
    _start: Vec3Array;
    _end: Vec3Array;
    _final: Vec3Array;
    _zeroVec3: Vec3Array;
    lerpFrames(): void;
    addEntity(entity: AnimatedPixelEntity): void;
    removeEntity(id: string): void;
    runAnimations(): void;
    getAnimationData(id: string): {
        frameOrder: number[];
        keyFrames: import("Types/PixelEntityData.types").PixelEntityKeyFrameData[];
    };
    getAnimationKeyFrame(id: string, frame: number): Flat3DAnyArray<[displacment: Vec3Array]>;
    getPixelData(x: number, y: number, z: number): false | PixelEntityIndexData;
    getPixelOriginalPosition(x: number, y: number, z: number): false | Vec3Array;
    getPixelMatrixIndex(x: number, y: number, z: number): number | false;
    _lightValues: [s: number, r: number, g: number, b: number];
    _findBrightestLight(sx: number, sy: number, sz: number): number;
}
