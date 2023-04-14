import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";
import type { CreatePixelEntityReturn } from "Types/PixelEntities.types";
import type { LocationData } from "voxelspaces";
import { MeshAttributes } from "divine-voxel-engine/Constructor/Builder/Types/MeshData.types.js";
import { Vec3Array } from "divine-voxel-engine/Math/index.js";
export declare class RendredPixelEntity {
    location: LocationData;
    size: Vec3Array;
    meshAttributes: MeshAttributes;
    mesh: Mesh;
    parent: TransformNode;
    id: string;
    constructor(location: LocationData, size: Vec3Array, meshAttributes: MeshAttributes, [animatedId, matricies, voxelData]: CreatePixelEntityReturn);
    update(): void;
    destroy(): void;
    setPosition(x: number, y: number, z: number): void;
}
