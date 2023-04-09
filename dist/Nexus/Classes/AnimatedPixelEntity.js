import { Flat3DAnyArray } from "divine-voxel-engine/Tools/Util/Flat3dArray.js";
import { LerpVec3Array } from "divine-voxel-engine/Math/Functions/LerpVec3.js";
import { PixelEntityBaseMatrix } from "../Constants/PixelEntityConstants.js";
import { PixelEntityAnimationManager } from "../Animations/PixelEntityAnimationManager.js";
export class AnimatedPixelEntity {
    data;
    id;
    pixelIndex;
    matrix;
    animation = {
        animation: "",
        count: 0,
        keyFrameTime: 0,
        frameIndex: 0,
        maxFrameIndex: 0,
        frameOrder: [],
    };
    nextFrame;
    currentFrame;
    processedKeyFrames = {};
    constructor(data, id = crypto.randomUUID()) {
        this.data = data;
        this.id = id;
        const dim = 0.125;
        this.pixelIndex = new Flat3DAnyArray(data.size, []);
        const instanceMatrix = [];
        const [bx, by, bz] = data.size;
        let cy = 0;
        let matrixIndex = 0;
        for (const layer of data.layers) {
            for (let y = cy; y < layer.height + cy; y++) {
                for (let z = 0; z < bz; z++) {
                    for (let x = 0; x < bx; x++) {
                        const pixel = layer.matrix[x][z];
                        if (!pixel)
                            continue;
                        const pixelData = data.pixels[pixel];
                        if (!pixelData)
                            continue;
                        for (const row of PixelEntityBaseMatrix) {
                            for (const col of row) {
                                instanceMatrix.push(col);
                            }
                        }
                        const i = matrixIndex * 16 + 12;
                        instanceMatrix[i] = x * dim;
                        instanceMatrix[i + 1] = y * dim;
                        instanceMatrix[i + 2] = z * dim;
                        this.pixelIndex.setValue(x, y, z, {
                            originalPosition: [x * dim, y * dim, z * dim],
                            position: [x * dim, y * dim, z * dim],
                            matrixIndex: matrixIndex,
                        });
                        matrixIndex++;
                    }
                }
            }
            cy += layer.height;
        }
        const matrixBufferSize = instanceMatrix.length * 4;
        const matrixBuffer = new SharedArrayBuffer(matrixBufferSize);
        this.matrix = new Float32Array(matrixBuffer);
        this.matrix.set(instanceMatrix);
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
        this.setAnimation(data.startingAnimation);
        PixelEntityAnimationManager.addEntity(this);
    }
    _getPercentTillNextFrame() {
        return this.animation.count / this.animation.keyFrameTime;
    }
    _runAnimationTick() {
        if (this.animation.count < this.animation.keyFrameTime) {
            this.animation.count++;
            return false;
        }
        this.animation.frameIndex++;
        if (this.animation.frameIndex >= this.animation.maxFrameIndex) {
            this.animation.frameIndex = 0;
        }
        this.animation.count = 0;
        this.currentFrame = this.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[this.animation.frameIndex]);
        this.animation.keyFrameTime =
            this.data.animations[this.animation.animation].keyFrames[this.animation.frameIndex].length;
        this.nextFrame = this.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[this.animation.frameIndex + 1]);
    }
    _zeroVec3 = [0, 0, 0];
    lerpFrames(start, end, percent) {
        const [bx, by, bz] = this.data.size;
        for (let y = 0; y < by; y++) {
            for (let z = 0; z < bz; z++) {
                for (let x = 0; x < bx; x++) {
                    const ogPositon = this.getPixelOriginalPosition(x, y, z);
                    if (!ogPositon)
                        continue;
                    const startVecC = start.getValue(x, y, z);
                    let startVec = this._zeroVec3;
                    if (startVecC) {
                        startVec = startVecC[0];
                    }
                    const endVecC = end.getValue(x, y, z);
                    let endVec = this._zeroVec3;
                    if (endVecC) {
                        endVec = endVecC[0];
                    }
                    const lerpedPosition = LerpVec3Array([
                        ogPositon[0] + startVec[0],
                        ogPositon[1] + startVec[1],
                        ogPositon[2] + startVec[2],
                    ], [
                        ogPositon[0] + endVec[0],
                        ogPositon[1] + endVec[1],
                        ogPositon[2] + endVec[2],
                    ], percent);
                    this.updatePixelPosition([x, y, z], lerpedPosition);
                }
            }
        }
    }
    setAnimation(id) {
        const data = this.getAnimationData(id);
        this.animation.animation = id;
        this.animation.count = 0;
        this.animation.maxFrameIndex = data.frameOrder.length - 1;
        this.animation.frameOrder = data.frameOrder;
        this.animation.keyFrameTime = data.keyFrames[data.frameOrder[0]].length;
        if (!this.currentFrame) {
            this.currentFrame = this.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[this.animation.frameIndex]);
            this.nextFrame = this.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[this.animation.frameIndex + 1]);
            return;
        }
        this.nextFrame = this.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[0]);
    }
    getAnimationData(id) {
        return this.data.animations[id];
    }
    getAnimationKeyFrame(id, frame) {
        return this.processedKeyFrames[id][frame];
    }
    getPixelData(x, y, z) {
        const value = this.pixelIndex.getValue(x, y, z);
        if (!value)
            return false;
        return value;
    }
    getPixelPosition(x, y, z) {
        const pixel = this.getPixelData(x, y, z);
        if (!pixel)
            return false;
        return pixel.position;
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
    updatePixelPosition([x, y, z], [nx, ny, nz]) {
        const matrixIndex = this.getPixelMatrixIndex(x, y, z);
        if (matrixIndex === false)
            return;
        const i = matrixIndex * 16 + 12;
        this.matrix[i] = nx;
        this.matrix[i + 1] = ny;
        this.matrix[i + 2] = nz;
    }
}
