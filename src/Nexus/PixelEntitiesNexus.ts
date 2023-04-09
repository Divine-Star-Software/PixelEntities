import type { CreatePixelEntityTask } from "Types/PixelEntities.types";

import { AnimatedPixelEntity } from "./Classes/AnimatedPixelEntity.js";

export const PixelEntitiesNexus = {
  createPixelEntity([location, data]: CreatePixelEntityTask) {
    const animatedEntity = new AnimatedPixelEntity(data);
    return [animatedEntity.id, animatedEntity.matrix] as const;
  },
};
