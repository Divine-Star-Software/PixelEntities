import type { LocationData } from "voxelspaces";
import { PixelEntityData } from "./PixelEntityData.types";
export declare type CreatePixelEntityShapeTask = [location: LocationData];
export declare type CreatePixelEntityTask = [
    location: LocationData,
    data: PixelEntityData
];
export declare type CreatePixelEntityReturn = [id: string, matrixArray: Float32Array];
