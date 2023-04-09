import { DVER } from "divine-voxel-engine/Render/DivineVoxelEngineRender.js";
import { PixelEntitesRender } from "../PixelEntitiesRender.js";
export class RendredPixelEntity {
    location;
    setNodeMesh;
    mesh;
    id;
    constructor(location, setNodeMesh, [animatedId, matrixBuffer]) {
        this.location = location;
        this.setNodeMesh = setNodeMesh;
        this.id = animatedId;
        const mesh = DVER.nodes.meshes.create("#dve_pixel_entity_mesh", setNodeMesh);
        if (!mesh)
            return;
        this.mesh = mesh;
        mesh.alwaysSelectAsActiveMesh = true;
        //@ts-ignore
        const parent = new DVER.babylon.system.TransformNode(DVER.render.scene);
        //@ts-ignore
        mesh.material.wireframe = true;
        mesh.thinInstanceSetBuffer("matrix", matrixBuffer);
        parent.parent = DVER.render.fo.activeNode;
        mesh.parent = parent;
        mesh.unfreezeWorldMatrix();
        parent.position = new DVER.babylon.system.Vector3(location[1], location[2], location[3]);
        parent.setPivotPoint(parent.position);
        PixelEntitesRender.entities.add(this);
    }
    update() {
        this.mesh.thinInstanceBufferUpdated("matrix");
    }
    destroy() {
        this.mesh.dispose();
        PixelEntitesRender.entities.delete(this);
    }
}
