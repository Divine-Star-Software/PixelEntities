import { DVEC } from "divine-voxel-engine/Constructor/DivineVoxelEngineConstructor.js";
import { PixelEntitiesConstructor } from "./PixelEntitiesConstructor.js";
export async function InitPixelEntitesConstructor() {
    DVEC.TC.registerTasks("create-pixel-entity-shape", async (data, onDone) => {
        if (!onDone)
            return;
        const meshData = await PixelEntitiesConstructor.createPixelEntity();
        onDone(meshData[0], meshData[1]);
    }, "deferred");
}
