import type { LocationData } from "voxelspaces";
import { PixelEntityData, ProcessedEntityData } from "./PixelEntityData.types";

export type CreatePixelEntityShapeTask = [location: LocationData];
export type CreatePixelEntityTask = [
  location: LocationData,
  data: ProcessedEntityData
];
export type CreatePixelEntityReturn = [id: string, matrixArray: Float32Array,voxelDataArray : Float32Array];
