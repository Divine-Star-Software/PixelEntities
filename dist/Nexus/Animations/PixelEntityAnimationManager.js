export const PixelEntityAnimationManager = {
    pixelEntities: new Set(),
    pixelEntitiesIndex: new Map(),
    addEntity(entity) {
        this.pixelEntities.add(entity);
        this.pixelEntitiesIndex.set(entity.id, entity);
    },
    removeEntity(id) {
        const entity = this.pixelEntitiesIndex.get(id);
        if (!entity)
            return;
        this.pixelEntities.delete(entity);
        this.pixelEntitiesIndex.delete(entity.id);
    },
    runAnimation() {
        if (this.pixelEntities.size == 0)
            return;
        for (const entity of this.pixelEntities) {
            entity._runAnimationTick();
            entity.lerpFrames(entity.currentFrame, entity.nextFrame, entity._getPercentTillNextFrame());
        }
    },
};
setInterval(() => {
    PixelEntityAnimationManager.runAnimation();
}, 50);
