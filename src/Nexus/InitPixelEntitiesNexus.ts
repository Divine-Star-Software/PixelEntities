import type { CreatePixelEntityTask } from "Types/PixelEntities.types";

import { DVEN } from "divine-voxel-engine/Nexus/DivineVoxelEngineNexus.js";

import { PixelEntitiesNexus } from "./PixelEntitiesNexus.js";
import { PixelEntityAnimationManager } from "./Animations/PixelEntityAnimationManager.js";

export async function InitPixelEntitesNexus() {
  DVEN.TC.registerTasks<CreatePixelEntityTask>(
    "create-pixel-entity",
    async (data, onDone) => {
      if (!onDone) return;
      const entityData = await PixelEntitiesNexus.createPixelEntity(data);
      onDone(entityData);
    },
    "deferred"
  );

  DVEN.TC.registerTasks<string>(
    "remove-pixel-entity",
    async (data, onDone) => {
      if (!onDone) return;
      PixelEntityAnimationManager.removeEntity(data);
    },
    "deferred"
  );
}
