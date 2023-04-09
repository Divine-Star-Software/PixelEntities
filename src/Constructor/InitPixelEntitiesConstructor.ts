import type { CreatePixelEntityShapeTask } from "Types/PixelEntities.types";
import type { SetNodeMesh } from "divine-voxel-engine/Meta/Tasks/RenderTasks.types.js";
import { DVEC } from "divine-voxel-engine/Constructor/DivineVoxelEngineConstructor.js";
import { PixelEntitiesConstructor } from "./PixelEntitiesConstructor.js";
export async function InitPixelEntitesConstructor() {
  DVEC.TC.registerTasks<CreatePixelEntityShapeTask>(
    "create-pixel-entity-shape",
    async (data, onDone) => {
      if (!onDone) return;
      const meshData = await PixelEntitiesConstructor.createPixelEntity();
      onDone(<SetNodeMesh>[data[0],meshData[0]], meshData[1]);
    },
    "deferred"
  );
}
