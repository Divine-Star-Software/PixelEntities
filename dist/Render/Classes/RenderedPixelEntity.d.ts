import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { CreatePixelEntityReturn } from "Types/PixelEntities.types";
import type { LocationData } from "voxelspaces";
import type { SetNodeMesh } from "divine-voxel-engine/Meta/Tasks/RenderTasks.types.js";
export declare class RendredPixelEntity {
    location: LocationData;
    setNodeMesh: SetNodeMesh;
    mesh: Mesh;
    id: string;
    constructor(location: LocationData, setNodeMesh: SetNodeMesh, [animatedId, matrixBuffer]: CreatePixelEntityReturn);
    update(): void;
    destroy(): void;
}
