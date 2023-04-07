import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";
export const PixelEntitesRender = {
    spawnEntity(id, location) {
        DVER.constructorCommManager.runPromiseTasks("create-pixel-entity", [id, location], [], ([nodeMeshData, matrixBuffer]) => {
            const mesh = DVER.nodes.meshes.create("pixel-entity", nodeMeshData);
            if (!mesh)
                return;
            mesh.thinInstanceBufferUpdated("matrix");
            mesh.thinInstanceSetBuffer("matrix", matrixBuffer);
        });
    },
};
