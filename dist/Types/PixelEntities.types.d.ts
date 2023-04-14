import type { LocationData } from "voxelspaces";
import { ProcessedEntityData } from "./PixelEntityData.types";
export declare type CreatePixelEntityShapeTask = [location: LocationData];
export declare type CreatePixelEntityTask = [
    location: LocationData,
    data: ProcessedEntityData
];
export declare type CreatePixelEntityReturn = [id: string, matrixArray: Float32Array, voxelDataArray: Float32Array];
