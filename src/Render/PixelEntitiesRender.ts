import type {
  CreatePixelEntityTask,
  CreatePixelEntityReturn,
  CreatePixelEntityShapeTask,
} from "Types/PixelEntities.types";
import type { LocationData } from "voxelspaces";

import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";
import { RendredPixelEntity } from "./Classes/RenderedPixelEntity.js";
import { MeshAttributes } from "divine-voxel-engine/Constructor/Builder/Types/MeshData.types.js";
import {
  PixelEntityData,
  ProcessedEntityData,
} from "Types/PixelEntityData.types.js";
import { Util } from "divine-voxel-engine/Global/Util.helper.js";
import { TextureManager } from "divine-voxel-engine/Render/Textures/TextureManager.js";
export const PixelEntitesRender = {
  entities: new Set<RendredPixelEntity>(),

  updateEntities() {
    for (const entitie of this.entities) {
      entitie.update();
    }
  },

  _getEntityShape(location: LocationData) {
    return new Promise<MeshAttributes>((resolve) => {
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

  spawnEntity([location, data]: [
    location: LocationData,
    data: PixelEntityData
  ]) {
    return new Promise<RendredPixelEntity>(async (resolve) => {
      const processed: ProcessedEntityData = Util.merge(
        {
          textureMap: {},
        },
        data
      );
      
      for (const key in processed.textures) {
        const texture = processed.textures[key];

        const id = TextureManager.getTextureUV(texture);
        processed.textureMap[key] = id;
      }

      const meshData = await this._getEntityShape(location);
      DVER.nexusComm.runPromiseTasks<CreatePixelEntityTask>(
        "create-pixel-entity",
        [location, processed],
        [],
        (returnData: CreatePixelEntityReturn) => {
          resolve(
            new RendredPixelEntity(location, data.size, meshData, returnData)
          );
        }
      );
    });
  },
};
const textureType = DVER.textures.addTextureType("#dve_pixel_entity");
console.log(textureType,"what the fuck");
textureType.removeSegment("overlay");

setInterval(() => {
  PixelEntitesRender.updateEntities();
}, 50);
