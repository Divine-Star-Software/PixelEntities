import { DivineShaderBuilder } from "divine-shaders/DivineShaderBuilder.js";
import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";

export async function InitPixelEntitesRender() {
  const shader = DivineShaderBuilder.shaders.create("#dve_pixel_entity_shader");
  shader.addAttributes([
    ["position", "vec3"],
    ["normal", "vec3"],

    ["cuv3", "vec3"],

    ["indices", "float"],
    ["voxelData", "float"],
  ]);
  shader.addUniform(
    [
      ["world", "mat4"],
      ["viewProjection", "mat4"],

      ["worldView", "mat4"],
      ["view", "mat4"],
      ["projection", "mat4"],
      ["viewProjection", "mat4"],

      ["lightGradient", "float", 16],

      ["sunLightLevel", "float"],
      ["baseLevel", "float"],
      ["doColor", "float"],
    ],
    "vertex"
  );

  shader.addVarying([
    {
      id: "cameraPOS",
      type: "vec3",
      body: {
        GLSL: () => "cameraPOS = cameraPosition;\n",
      },
    },
    {
      id: "worldPOS",
      type: "vec3",
      body: {
        GLSL: () => `vec4 worldPOSTemp =  world * vec4(position, 1.0);
           worldPOS = vec3(worldPOSTemp.x,worldPOSTemp.y,worldPOSTemp.z);`,
      },
    },
    {
      id: "vDistance",
      type: "float",
      body: {
        GLSL: () => " vDistance = distance(cameraPOS , worldPOS );\n",
      },
    },
    {
      id: "mipMapLevel",
      type: "float",
      body: {
        GLSL: () => `
         mipMapLevel = 0.;
         if(vDistance <= 30.) {
          mipMapLevel = 0.;
         }
         if(vDistance > 50. &&  vDistance <= 70.) {
          mipMapLevel = 1.;
         }
         if(vDistance > 70. && vDistance < 90.) {
           mipMapLevel = 2.;
         }
         if(vDistance >= 90.) {
          mipMapLevel = 3.;
          }
         `,
      },
    },
  ]);

  shader.addUniform(
    [
      ["fogOptions", "vec4"],
      ["vFogInfos", "vec4"],
      ["vFogColor", "vec3"],
      ["time", "float"],
      ["cameraPosition", "vec3"],
      ["cameraDirection", "vec3"],
    ],
    "shared"
  );

  shader.addVarying([
    {
      id: "VOXEL",
      type: "mat4",
      body: {
        GLSL: () => `
 mat4 vData;
 
 uint vUID = uint(voxelData);
 uint lightMask = uint(${0xf});
 uint aoMask = uint(${0b11});
 uint animMask = uint(${0b1111_1111_1111_11});
 
 uint index = uint(0);
 float sVL = lightGradient[int(((lightMask << index) & vUID) >> index)];

 index = uint(4);
 float rVL = lightGradient[int(((lightMask << index) & vUID) >> index)];

 index = uint(4);
 float gVL = lightGradient[int(((lightMask << index) & vUID) >> index)];

 index = uint(12);
 float bVL = lightGradient[int(((lightMask << index) & vUID) >> index)];


 index = uint(16);
 float AOVL = float(((aoMask << index) & vUID) >> index);
 if(AOVL > 1.) {
      AOVL = pow( pow(.65, AOVL - 1. ), 2.2);
 }
 
 index = uint(18);
 float animVL = float(((animMask << index) & vUID) >> index);
 
 
 vData[0] = vec4(
      ( (
 (vec3(rVL,gVL,bVL)) 
 +  ((sVL   * sunLightLevel))  ) 
 + baseLevel).rgb,
 1.) ;

 vData[1] = vec4(AOVL,animVL,0.,0.);     
 VOXEL = vData;
 `,
      },
    },
  ]);

  shader.data.vertexBeforeMain.GLSL = `
  #ifdef INSTANCES
  //matricies
  in vec4 world0;
  in vec4 world1;
  in vec4 world2;
  in vec4 world3;

  //custom attributes

  #endif

  #ifdef THIN_INSTANCES
  uniform mat4 previousWorld;
  #endif
`;
  shader.data.vertexMain.GLSL = `
  #ifdef INSTANCES
  mat4 finalWorld=mat4(world0,world1,world2,world3);
  #endif
  #ifdef THIN_INSTANCES
  finalWorld=world*finalWorld;
  #endif

  gl_Position = viewProjection *  world * finalWorld * vec4(position, 1.0);  
`;

  DVER.nodes.shaders.create([shader]);
  DVER.nodes.materials.create([
    {
      id: "#dve_pixel_entity_material",
      alphaBlending: false,
      alphaTesting: true,
      shaderId: "#dve_pixel_entity_shader",
      textureTypeId: "#dve_pixel_entity",
    },
  ]);

  shader.loadInFunctions(
    [
      "#dve_fmb2",
      "#dve_fmb3",
      "#dve_fog",
      "doFog",
      "getAO",
      "getLight",
      "getBase",
      "getMainColor",
    ],
    "frag"
  );

  shader.setCodeBody(
    "frag",
    `vec4 rgb = getMainColor(vec2(0.,0.));
    if (rgb.a < 0.5) { 
     discard;
   }
 //  rgb = getAO(rgb);
    rgb = getLight(rgb);
    vec3 finalColor = doFog(rgb);
    FragColor = vec4(finalColor.rgb,rgb.a);`
  );

  const material = DVER.nodes.materials.get("#dve_pixel_entity_material")!;

  material.afterCreate.push((material) => {
    material.setFloats("lightGradient", DVER.render.lightGradient);
  });

  DVER.nodes.meshes.add([
    {
      id: "#dve_pixel_entity_mesh",
      boundingBoxMaxSize: [10, 10, 10],
      materialId: "#dve_pixel_entity_material",
    },
  ]);
}
