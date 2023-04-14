import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";
import type { CreatePixelEntityReturn } from "Types/PixelEntities.types";
import type { LocationData } from "voxelspaces";

import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";

import { PixelEntitesRender } from "../PixelEntitiesRender.js";
import { MeshAttributes } from "divine-voxel-engine/Constructor/Builder/Types/MeshData.types.js";
import { Vec3Array } from "divine-voxel-engine/Math/index.js";

export class RendredPixelEntity {
  mesh: Mesh;
  parent: TransformNode;
  id: string;
  constructor(
    public location: LocationData,
    public size: Vec3Array,
    public meshAttributes: MeshAttributes,
    [animatedId, matricies, voxelData]: CreatePixelEntityReturn
  ) {
    this.id = animatedId;
    const mesh = DVER.nodes.meshes.create("#dve_pixel_entity_mesh", [
      ["main", 0, 0, 0],
      meshAttributes,
    ]);
    if (!mesh) return;
    this.mesh = mesh;
    this.parent = new DVER.babylon.system.TransformNode(this.id);
    mesh.parent = this.parent;
    mesh.alwaysSelectAsActiveMesh = true;

    mesh.thinInstanceSetBuffer("matrix", matricies);
    mesh.thinInstanceSetBuffer("voxelData", voxelData, 1);
    this.parent.parent = DVER.render.fo.activeNode;
    mesh.unfreezeWorldMatrix();

    this.setPosition(this.location[1], this.location[2], this.location[3]);

    PixelEntitesRender.entities.add(this);
  }

  update() {
    this.mesh.thinInstanceBufferUpdated("matrix");
    this.mesh.thinInstanceBufferUpdated("voxelData");
  }

  destroy() {
    this.parent.dispose();
    this.mesh.dispose();
    PixelEntitesRender.entities.delete(this);
  }

  setPosition(x: number, y: number, z: number) {
    this.parent.position.set(x, y, z);
  }
}
