import type { SetNodeMesh } from "divine-voxel-engine/Meta/Tasks/RenderTasks.types";
import type { LocationData } from "voxelspaces";
export declare type CreatePixelEntityTask = [id: string, location: LocationData];
export declare type CreatePixelEntityReturn = [
    setNodeMesh: SetNodeMesh,
    matrixArray: Float32Array
];
