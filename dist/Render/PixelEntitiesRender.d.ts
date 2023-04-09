import type { CreatePixelEntityTask } from "Types/PixelEntities.types";
import type { LocationData } from "voxelspaces";
import { RendredPixelEntity } from "./Classes/RenderedPixelEntity.js";
import { SetNodeMesh } from "divine-voxel-engine/Meta/Tasks/RenderTasks.types.js";
export declare const PixelEntitesRender: {
    entities: Set<RendredPixelEntity>;
    updateEntities(): void;
    _getEntityShape(location: LocationData): Promise<SetNodeMesh>;
    spawnEntity([location, data]: CreatePixelEntityTask): Promise<RendredPixelEntity>;
};
