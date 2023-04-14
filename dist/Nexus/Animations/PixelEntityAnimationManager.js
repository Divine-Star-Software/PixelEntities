import { AnimatedPixelEntityType } from "../Classes/AnimatedPixelEntityType.js";
export const PixelEntityAnimationManager = {
    pixelEntitiesTypeIndex: new Map(),
    addEntityType(entity) {
        this.pixelEntitiesTypeIndex.set(entity.data.id, entity);
    },
    getEntityType(data) {
        let type = this.pixelEntitiesTypeIndex.get(data.id);
        if (!type) {
            type = new AnimatedPixelEntityType(data);
            this.pixelEntitiesTypeIndex.set(data.id, type);
        }
        return type;
    },
    removeEntity(id) {
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
