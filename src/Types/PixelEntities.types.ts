import type { SetNodeMesh } from "divine-voxel-engine/Meta/Tasks/RenderTasks.types";
import type { LocationData } from "voxelspaces";

export type CreatePixelEntityTask = [id: string, location: LocationData];
export type CreatePixelEntityReturn = [
  setNodeMesh : SetNodeMesh,
  matrixArray: Float32Array
];
