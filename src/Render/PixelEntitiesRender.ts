import type {
  CreatePixelEntityTask,
  CreatePixelEntityReturn,
  CreatePixelEntityShapeTask,
} from "Types/PixelEntities.types";
import type { LocationData } from "voxelspaces";

import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";
import { RendredPixelEntity } from "./Classes/RenderedPixelEntity.js";
import { SetNodeMesh } from "divine-voxel-engine/Meta/Tasks/RenderTasks.types.js";

export const PixelEntitesRender = {
  entities: new Set<RendredPixelEntity>(),

  updateEntities() {
    for (const entitie of this.entities) {
      entitie.update();
    }
  },

  _getEntityShape(location: LocationData) {
    return new Promise<SetNodeMesh>((resolve) => {
      DVER.constructorCommManager.runPromiseTasks<CreatePixelEntityShapeTask>(
        "create-pixel-entity-shape",
        [location],
        [],
        (returnData) => {
          resolve(returnData);
        }
      );
    });
  },

  spawnEntity([location, data]: CreatePixelEntityTask) {
    return new Promise<RendredPixelEntity>(async (resolve) => {
      const meshData = await this._getEntityShape(location);
      DVER.nexusComm.runPromiseTasks<CreatePixelEntityTask>(
        "create-pixel-entity",
        [location,data],
        [],
        (returnData: CreatePixelEntityReturn) => {
          resolve(new RendredPixelEntity(location, meshData, returnData));
        }
      );
    });
  },
};

setInterval(() => {
  PixelEntitesRender.updateEntities();
}, 50);
