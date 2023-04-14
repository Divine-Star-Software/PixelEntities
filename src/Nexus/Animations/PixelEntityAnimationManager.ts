import { AnimatedPixelEntityType } from "../Classes/AnimatedPixelEntityType.js";
import type { AnimatedPixelEntity } from "../Classes/AnimatedPixelEntity.js";
import type { ProcessedEntityData } from "Types/PixelEntityData.types.js";

export const PixelEntityAnimationManager = {
  pixelEntitiesTypeIndex: new Map<string, AnimatedPixelEntityType>(),

  addEntityType(entity: AnimatedPixelEntityType) {
    this.pixelEntitiesTypeIndex.set(entity.data.id, entity);
  },

  getEntityType(data: ProcessedEntityData) {
    let type = this.pixelEntitiesTypeIndex.get(data.id);
    if (!type) {
      type = new AnimatedPixelEntityType(data);
      this.pixelEntitiesTypeIndex.set(data.id, type);
    }
    return type;
  },

  removeEntity(id: string) {
    for (const [key, type] of this.pixelEntitiesTypeIndex) {
      type.removeEntity(id);
    }
  },

  runAnimation() {
    for (const [index, type] of this.pixelEntitiesTypeIndex) {
      type.runAnimations();
    }
  },
};

setInterval(() => {
  PixelEntityAnimationManager.runAnimation();
}, 50);
