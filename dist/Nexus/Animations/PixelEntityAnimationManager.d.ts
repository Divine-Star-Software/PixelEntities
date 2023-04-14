import { AnimatedPixelEntityType } from "../Classes/AnimatedPixelEntityType.js";
import type { ProcessedEntityData } from "Types/PixelEntityData.types.js";
export declare const PixelEntityAnimationManager: {
    pixelEntitiesTypeIndex: Map<string, AnimatedPixelEntityType>;
    addEntityType(entity: AnimatedPixelEntityType): void;
    getEntityType(data: ProcessedEntityData): AnimatedPixelEntityType;
    removeEntity(id: string): void;
    runAnimation(): void;
};
