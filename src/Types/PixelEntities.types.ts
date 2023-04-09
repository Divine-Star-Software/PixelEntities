import type { LocationData } from "voxelspaces";
import { PixelEntityData } from "./PixelEntityData.types";

export type CreatePixelEntityShapeTask = [location: LocationData];
export type CreatePixelEntityTask = [
  location: LocationData,
  data: PixelEntityData
];
export type CreatePixelEntityReturn = [id: string, matrixArray: Float32Array];
