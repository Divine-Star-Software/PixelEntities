import { AnimatedPixelEntity } from "./Classes/AnimatedPixelEntity.js";
export const PixelEntitiesNexus = {
    createPixelEntity([location, data]) {
        const animatedEntity = new AnimatedPixelEntity(location, data);
        return [animatedEntity.id, animatedEntity.matrix, animatedEntity.voxelData];
    },
};
