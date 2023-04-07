import { DVEC } from "divine-voxel-engine/Constructor/DivineVoxelEngineConstructor.js";
import { MeshBuilderTool } from "divine-voxel-engine/Constructor/Builder/Tools/MeshBuilderTool.js";
import { MesherDataTool } from "divine-voxel-engine/Constructor/Builder/Tools/MesherDataTools.js";
const mesher = new MeshBuilderTool();
const mesherData = new MesherDataTool();
mesherData.attributes.add([["nodeData", [[], 1, "32f"]]]);
mesherData.vars.add([["texture", 0]]);
mesher.setMesherTool(mesherData);
const indentiyMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
];
export const PixelEntitiesConstructor = {
    $INIT() {
        DVEC.TC.registerTasks("create-pixel-entity", (data, onDone) => {
            if (!onDone)
                return;
        }, "deferred");
    },
    createPixelEntity(data) {
        mesher.quad.setDimensions(1, 1);
        mesher.quad
            .setDirection("top")
            .updatePosition(0.5, 1, 0.5)
            .create()
            .setDirection("bottom")
            .updatePosition(0.5, 0, 0.5)
            .create()
            .setDirection("north")
            .updatePosition(0.5, 0.5, 1)
            .create()
            .setDirection("south")
            .updatePosition(0.5, 0.5, 0)
            .create()
            .setDirection("east")
            .updatePosition(1, 0.5, 0.5)
            .create()
            .setDirection("west")
            .updatePosition(0, 0.5, 0.5)
            .create();
        const numInstances = 5;
        const matrixBuffersize = 16 * 4 * numInstances;
        const instanceMatrixBuffer = new SharedArrayBuffer(matrixBuffersize);
        const instanceMatrix = new Float32Array(instanceMatrixBuffer);
        let i = numInstances;
        let k = 0;
        while (i--) {
            for (const row of indentiyMatrix) {
                for (const col of row) {
                    instanceMatrix[k] = col;
                    k++;
                }
            }
        }
        const meshData = mesherData.getAllAttributes();
        mesher.quad.clear();
        mesherData.resetAll();
        return [meshData, instanceMatrix];
    },
};
