import { DivineShaderBuilder } from "divine-shaders/DivineShaderBuilder.js";
import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";

export async function InitPixelEntitesRender() {
  const shader = DivineShaderBuilder.shaders.create("#dve_pixel_entity_shader");
  shader.addAttributes([
    ["position", "vec3"],
    ["normal", "vec3"],
    ["indices", "float"],
  ]);
  shader.addUniform(
    [
      ["world", "mat4"],
      ["viewProjection", "mat4"],

      ["worldView", "mat4"],
      ["view", "mat4"],
      ["projection", "mat4"],
      ["viewProjection", "mat4"],
    ],
    "vertex"
  );



/*
  #ifdef INSTANCES
  in vec4 world0;
  in vec4 world1;
  in vec4 world2;
  in vec4 world3;
  #ifdef INSTANCESCOLOR
  in vec4 instanceColor;
  #endif
  #if defined(THIN_INSTANCES) && !defined(WORLD_UBO)
  uniform mat4 world;
  #endif
  #if defined(VELOCITY) || defined(PREPASS_VELOCITY)
  in vec4 previousWorld0;
  in vec4 previousWorld1;
  in vec4 previousWorld2;
  in vec4 previousWorld3;
  #ifdef THIN_INSTANCES
  uniform mat4 previousWorld;
  #endif
  #endif
  #else
  #if !defined(WORLD_UBO)
  uniform mat4 world;
  #endif
  #if defined(VELOCITY) || defined(PREPASS_VELOCITY)
  uniform mat4 previousWorld;
  #endif
  #endif  



gl_Position = viewProjection * finalWorld * vec4(position, 1.0);  

*/


  shader.data.vertexBeforeMain.GLSL = `
  #ifdef INSTANCES
  in vec4 world0;
  in vec4 world1;
  in vec4 world2;
  in vec4 world3;
  #ifdef INSTANCESCOLOR
  in vec4 instanceColor;
  #endif

  #if defined(VELOCITY) || defined(PREPASS_VELOCITY)
  in vec4 previousWorld0;
  in vec4 previousWorld1;
  in vec4 previousWorld2;
  in vec4 previousWorld3;
  #ifdef THIN_INSTANCES
  uniform mat4 previousWorld;
  #endif
  #endif
  #else
  #if defined(VELOCITY) || defined(PREPASS_VELOCITY)
  uniform mat4 previousWorld;
  #endif
  #endif  
`;
  shader.data.vertexMain.GLSL = `
  #ifdef INSTANCES
  mat4 finalWorld=mat4(world0,world1,world2,world3);
  #if defined(PREPASS_VELOCITY) || defined(VELOCITY)
  mat4 finalPreviousWorld=mat4(previousWorld0,previousWorld1,previousWorld2,previousWorld3);
  #endif
  #ifdef THIN_INSTANCES
  finalWorld=world*finalWorld;
  #if defined(PREPASS_VELOCITY) || defined(VELOCITY)
  finalPreviousWorld=previousWorld*finalPreviousWorld;
  #endif
  #endif
  #else
  mat4 finalWorld=world ;
  #if defined(PREPASS_VELOCITY) || defined(VELOCITY)
  mat4 finalPreviousWorld=previousWorld;
  #endif
  #endif

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
  const material = DVER.nodes.materials.get("#dve_pixel_entity_material")!;

  material.createMaterial();

  DVER.nodes.meshes.add([
    {
      id: "#dve_pixel_entity_mesh",
      boundingBoxMaxSize: [10, 10, 10],
      materialId: "#dve_pixel_entity_material",
    },
  ]);
}
