import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";
import { RendredPixelEntity } from "./Classes/RenderedPixelEntity.js";
import { Util } from "divine-voxel-engine/Global/Util.helper.js";
import { TextureManager } from "divine-voxel-engine/Render/Textures/TextureManager.js";
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
            const processed = Util.merge({
                textureMap: {},
            }, data);
            for (const key in processed.textures) {
                const texture = processed.textures[key];
                const id = TextureManager.getTextureUV(texture);
                processed.textureMap[key] = id;
            }
            const meshData = await this._getEntityShape(location);
            DVER.nexusComm.runPromiseTasks("create-pixel-entity", [location, processed], [], (returnData) => {
                resolve(new RendredPixelEntity(location, data.size, meshData, returnData));
            });
        });
    },
};
const textureType = DVER.textures.addTextureType("#dve_pixel_entity");
console.log(textureType, "what the fuck");
textureType.removeSegment("overlay");
setInterval(() => {
    PixelEntitesRender.updateEntities();
}, 50);
