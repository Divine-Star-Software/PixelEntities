import type { LocationData } from "voxelspaces";
import { RendredPixelEntity } from "./Classes/RenderedPixelEntity.js";
import { MeshAttributes } from "divine-voxel-engine/Constructor/Builder/Types/MeshData.types.js";
import { PixelEntityData } from "Types/PixelEntityData.types.js";
export declare const PixelEntitesRender: {
    entities: Set<RendredPixelEntity>;
    updateEntities(): void;
    _getEntityShape(location: LocationData): Promise<MeshAttributes>;
    spawnEntity([location, data]: [location: LocationData, data: PixelEntityData]): Promise<RendredPixelEntity>;
};
