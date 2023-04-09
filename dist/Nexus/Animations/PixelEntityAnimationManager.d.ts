import type { AnimatedPixelEntity } from "../Classes/AnimatedPixelEntity.js";
export declare const PixelEntityAnimationManager: {
    pixelEntities: Set<AnimatedPixelEntity>;
    pixelEntitiesIndex: Map<string, AnimatedPixelEntity>;
    addEntity(entity: AnimatedPixelEntity): void;
    removeEntity(id: string): void;
    runAnimation(): void;
};
