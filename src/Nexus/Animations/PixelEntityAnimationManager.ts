import type { AnimatedPixelEntity } from "../Classes/AnimatedPixelEntity.js";

export const PixelEntityAnimationManager = {
  pixelEntities: new Set<AnimatedPixelEntity>(),
  pixelEntitiesIndex: new Map<string, AnimatedPixelEntity>(),

  addEntity(entity: AnimatedPixelEntity) {
    this.pixelEntities.add(entity);
    this.pixelEntitiesIndex.set(entity.id, entity);
  },

  removeEntity(id: string) {
    const entity = this.pixelEntitiesIndex.get(id);
    if (!entity) return;
    this.pixelEntities.delete(entity);
    this.pixelEntitiesIndex.delete(entity.id);
  },

  runAnimation() {
    if (this.pixelEntities.size == 0) return;
    for (const entity of this.pixelEntities) {
      entity._runAnimationTick();

      entity.lerpFrames(
        entity.currentFrame,
        entity.nextFrame,
        entity._getPercentTillNextFrame()
      );
    }
  },
};

setInterval(() => {
  PixelEntityAnimationManager.runAnimation();
}, 50);
