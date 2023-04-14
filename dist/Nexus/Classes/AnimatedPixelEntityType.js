import { Flat3DAnyArray } from "divine-voxel-engine/Tools/Util/Flat3dArray.js";
import { PixelEntityBaseMatrix } from "../Constants/PixelEntityConstants.js";
import { DataTool } from "divine-voxel-engine/Tools/Data/DataTool.js";
import { $3dCardinalNeighbors } from "divine-voxel-engine/Math/Constants/CardinalNeighbors.js";
import { LightData } from "divine-voxel-engine/Data/Light/LightByte.js";
const dataTool = new DataTool();
export class AnimatedPixelEntityType {
    data;
    pixelIndex = [];
    pixelFlatIndex;
    matrix = [];
    voxelData = [];
    entities = new Set();
    entitiesIndex = new Map();
    _arrayToSAB(data, byteSize = 4) {
        const matrixBufferSize = data.length * byteSize;
        const matrixBuffer = new SharedArrayBuffer(matrixBufferSize);
        const matrix = new Float32Array(matrixBuffer);
        matrix.set(data);
        return matrix;
    }
    processedKeyFrames = {};
    getLightMap() {
        const array = new Flat3DAnyArray(this.data.size, []);
        for (let i = 0; i < this.pixelIndex.length; i++) {
            const x = this.pixelIndex[i][0];
            const y = this.pixelIndex[i][1];
            const z = this.pixelIndex[i][2];
            array.setValue(x, y, z, {
                voxelPosition: [-Infinity, -Infinity, -Infinity],
            });
        }
        return array;
    }
    getInstanceData() {
        return [this._arrayToSAB(this.matrix), this._arrayToSAB(this.voxelData)];
    }
    constructor(data) {
        this.data = data;
        const dim = 0.125;
        this.pixelFlatIndex = new Flat3DAnyArray(data.size, []);
        let cy = 0;
        let matrixIndex = 0;
        for (const segmentKey in data.segments) {
            const segment = data.segments[segmentKey];
            const [fx, fy, fz] = segment.offset;
            for (const layer of segment.layers) {
                for (let y = cy; y < layer.height + cy; y++) {
                    const bz = layer.matrix.length;
                    for (let z = 0; z < bz; z++) {
                        const bx = layer.matrix[z].length;
                        for (let x = 0; x < bx; x++) {
                            const pixel = layer.matrix[z][x];
                            if (!pixel)
                                continue;
                            const pixelData = segment.pixels[pixel];
                            if (!pixelData)
                                continue;
                            for (const row of PixelEntityBaseMatrix) {
                                for (const col of row) {
                                    this.matrix.push(col);
                                }
                            }
                            let tx = x + fx;
                            let ty = y + fy;
                            let tz = z + fz;
                            this.pixelIndex.push([tx, ty, tz]);
                            const i = matrixIndex * 16 + 12;
                            this.voxelData.push(0);
                            this.matrix[i] = tx * dim;
                            this.matrix[i + 1] = ty * dim;
                            this.matrix[i + 2] = tz * dim;
                            this.pixelFlatIndex.setValue(tx, ty, tz, {
                                originalPosition: [tx * dim, ty * dim, tz * dim],
                                position: [tx * dim, ty * dim, tz * dim],
                                matrixIndex: matrixIndex,
                            });
                            matrixIndex++;
                        }
                    }
                }
                cy += layer.height;
            }
        }
        for (const animKey in data.animations) {
            const anim = data.animations[animKey];
            let frames = this.processedKeyFrames[animKey];
            if (!frames) {
                frames = [];
                this.processedKeyFrames[animKey] = frames;
            }
            for (const frame of anim.keyFrames) {
                const frameIndex = new Flat3DAnyArray(data.size, []);
                frames.push(frameIndex);
                for (const data of frame.pixels) {
                    const [pixel, displacment] = data;
                    const [[sx, sy, sz], [ex, ey, ez]] = pixel;
                    for (let y = sy; y <= ey; y++) {
                        for (let z = sz; z <= ez; z++) {
                            for (let x = sx; x <= ex; x++) {
                                frameIndex.setValue(x, y, z, [displacment]);
                            }
                        }
                    }
                }
            }
        }
    }
    _start = [0, 0, 0];
    _end = [0, 0, 0];
    _final = [0, 0, 0];
    _zeroVec3 = [0, 0, 0];
    lerpFrames() {
        for (let i = 0; i < this.pixelIndex.length; i++) {
            const x = this.pixelIndex[i][0];
            const y = this.pixelIndex[i][1];
            const z = this.pixelIndex[i][2];
            const ogPositon = this.getPixelOriginalPosition(x, y, z);
            if (!ogPositon)
                continue;
            for (const entity of this.entities) {
                entity.update(this.pixelIndex[i], ogPositon);
            }
        }
    }
    addEntity(entity) {
        this.entities.add(entity);
        this.entitiesIndex.set(entity.id, entity);
    }
    removeEntity(id) {
        const entity = this.entitiesIndex.get(id);
        if (!entity)
            return;
        this.entities.delete(entity);
        this.entitiesIndex.delete(entity.id);
    }
    runAnimations() {
        for (const entity of this.entities) {
            entity._runAnimationTick();
        }
        this.lerpFrames();
    }
    getAnimationData(id) {
        return this.data.animations[id];
    }
    getAnimationKeyFrame(id, frame) {
        return this.processedKeyFrames[id][frame];
    }
    getPixelData(x, y, z) {
        const value = this.pixelFlatIndex.getValue(x, y, z);
        if (!value)
            return false;
        return value;
    }
    getPixelOriginalPosition(x, y, z) {
        const pixel = this.getPixelData(x, y, z);
        if (!pixel)
            return false;
        return pixel.originalPosition;
    }
    getPixelMatrixIndex(x, y, z) {
        const pixel = this.getPixelData(x, y, z);
        if (!pixel)
            return false;
        return pixel.matrixIndex;
    }
    _lightValues = [0, 0, 0, 0];
    _findBrightestLight(sx, sy, sz) {
        let x = Math.ceil(sx);
        let y = Math.ceil(sy);
        let z = Math.ceil(sz);
        if (dataTool.loadInAt(x, y, z)) {
            const light = dataTool.getLight();
            if (light >= 0)
                return light;
        }
        //if the entity voxel is inside a voxel find the brightest neighbor
        while (true) {
            if (!dataTool.loadInAt(x, y, z))
                break;
            if (dataTool.isAir())
                break;
            y++;
        }
        for (const n of $3dCardinalNeighbors) {
            if (!dataTool.loadInAt(x + n[0], y + n[1], z + n[2]))
                continue;
            let l = dataTool.getLight();
            if (l <= 0)
                continue;
            const v = LightData.getLightValues(l);
            for (let i = 0; i < 4; i++) {
                if (this._lightValues[i] < v[i]) {
                    this._lightValues[i] = v[i];
                }
            }
        }
        let brightest = LightData.setLightValues(this._lightValues);
        for (let i = 0; i < 4; i++) {
            this._lightValues[i] = 0;
        }
        return LightData.minusOneForAll(brightest);
    }
}
