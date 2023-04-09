import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";
import { RendredPixelEntity } from "./Classes/RenderedPixelEntity.js";
export const PixelEntitesRender = {
    entities: new Set(),
    updateEntities() {
        for (const entitie of this.entities) {
            entitie.update();
        }
    },
    _getEntityShape(location) {
        return new Promise((resolve) => {
            DVER.constructorCommManager.runPromiseTasks("create-pixel-entity-shape", [location], [], (returnData) => {
                resolve(returnData);
            });
        });
    },
    spawnEntity([location, data]) {
        return new Promise(async (resolve) => {
            const meshData = await this._getEntityShape(location);
            DVER.nexusComm.runPromiseTasks("create-pixel-entity", [location, data], [], (returnData) => {
                resolve(new RendredPixelEntity(location, meshData, returnData));
            });
        });
    },
};
setInterval(() => {
    PixelEntitesRender.updateEntities();
}, 50);
