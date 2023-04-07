import type { LocationData } from "voxelspaces";

import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";
import {
  CreatePixelEntityReturn,
  CreatePixelEntityTask,
} from "Types/PixelEntities.types";

export const PixelEntitesRender = {
  spawnEntity(id: string, location: LocationData) {
    DVER.constructorCommManager.runPromiseTasks<CreatePixelEntityTask>(
      "create-pixel-entity",
      [id, location],
      [],
      ([nodeMeshData, matrixBuffer]: CreatePixelEntityReturn) => {
        const mesh = DVER.nodes.meshes.create("pixel-entity", nodeMeshData);
        if (!mesh) return;
        mesh.thinInstanceBufferUpdated("matrix");
        mesh.thinInstanceSetBuffer("matrix", matrixBuffer);
      }
    );
  },
};
