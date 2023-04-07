import { DivineShaderBuilder } from "divine-shaders/DivineShaderBuilder.js";
import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";
export function InitPixelEntites() {
    const shader = DivineShaderBuilder.shaders.create("#dve_pixel_entity_shader");
    shader.addAttributes([
        ["position", "vec3"],
        ["normal", "vec3"],
        ["indices", "float"],
    ]);
    shader.addUniform([
        ["world", "mat4"],
        ["viewProjection", "mat4"],
        ["worldView", "ignore"],
        ["view", "ignore"],
        ["projection", "ignore"],
        ["viewProjection", "ignore"],
    ], "vertex");
    shader.data.vertexBeforeMain.GLSL = `#include<instancesDeclaration>`;
    shader.data.vertexTop.GLSL = `#include<instancesVertex>`;
    shader.data.vertexMain.GLSL = `
gl_Position = viewProjection * finalWorld * vec4(position, 1.0);  
`;
    shader.setCodeBody("frag", `FragColor = vec4(1.);`);
    DVER.nodes.shaders.create([shader]);
    DVER.nodes.materials.create([
        {
            id: "#dve_pixel_entity_material",
            alphaBlending: false,
            alphaTesting: true,
            shaderId: "#dve_pixel_entity_shader",
        },
    ]);
    DVER.nodes.meshes.add([
        {
            id: "#dve_pixel_entity_mesh",
            boundingBoxMaxSize: [10, 10, 10],
            materialId: "#dve_pixel_entity_material",
        },
    ]);
}
