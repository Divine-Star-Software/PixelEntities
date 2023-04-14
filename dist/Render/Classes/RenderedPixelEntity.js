import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";
import { PixelEntitesRender } from "../PixelEntitiesRender.js";
export class RendredPixelEntity {
    location;
    size;
    meshAttributes;
    mesh;
    parent;
    id;
    constructor(location, size, meshAttributes, [animatedId, matricies, voxelData]) {
        this.location = location;
        this.size = size;
        this.meshAttributes = meshAttributes;
        this.id = animatedId;
        const mesh = DVER.nodes.meshes.create("#dve_pixel_entity_mesh", [
            ["main", 0, 0, 0],
            meshAttributes,
        ]);
        if (!mesh)
            return;
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
    setPosition(x, y, z) {
        this.parent.position.set(x, y, z);
    }
}
