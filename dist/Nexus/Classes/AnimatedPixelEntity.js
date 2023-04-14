import { LerpVec3Array } from "divine-voxel-engine/Math/Functions/LerpVec3.js";
import { PixelEntityAnimationManager } from "../Animations/PixelEntityAnimationManager.js";
import { VoxelShaderDataTool } from "divine-voxel-engine/Tools/Shaders/VoxelShaderData.js";
const voxelShader = new VoxelShaderDataTool();
export class AnimatedPixelEntity {
    location;
    data;
    id;
    matrix;
    voxelData;
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
    pixelFlatIndex;
    type;
    lightMap;
    constructor(location, data, id = crypto.randomUUID()) {
        this.location = location;
        this.data = data;
        this.id = id;
        this.type = PixelEntityAnimationManager.getEntityType(data);
        const [matrix, voxelData] = this.type.getInstanceData();
        this.matrix = matrix;
        this.voxelData = voxelData;
        this.type.addEntity(this);
        this.lightMap = this.type.getLightMap();
        this.setAnimation(data.startingAnimation);
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
        this.currentFrame = this.type.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[this.animation.frameIndex]);
        this.animation.keyFrameTime =
            this.data.animations[this.animation.animation].keyFrames[this.animation.frameIndex].length;
        this.nextFrame = this.type.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[this.animation.frameIndex + 1]);
    }
    _start = [0, 0, 0];
    _end = [0, 0, 0];
    _final = [0, 0, 0];
    _zeroVec3 = [0, 0, 0];
    update([x, y, z], ogPositon) {
        const percent = this._getPercentTillNextFrame();
        const startVecC = this.currentFrame.getValue(x, y, z);
        let startVec = this._zeroVec3;
        if (startVecC) {
            startVec = startVecC[0];
        }
        const endVecC = this.nextFrame.getValue(x, y, z);
        let endVec = this._zeroVec3;
        if (endVecC) {
            endVec = endVecC[0];
        }
        this._start[0] = ogPositon[0] + startVec[0];
        this._start[1] = ogPositon[1] + startVec[1];
        this._start[2] = ogPositon[2] + startVec[2];
        this._end[0] = ogPositon[0] + endVec[0];
        this._end[1] = ogPositon[1] + endVec[1];
        this._end[2] = ogPositon[2] + endVec[2];
        this._final[0] = x;
        this._final[1] = y;
        this._final[2] = z;
        this.updatePixelPosition(this._final, LerpVec3Array(this._start, this._end, percent));
    }
    setAnimation(id) {
        const data = this.type.getAnimationData(id);
        this.animation.animation = id;
        this.animation.count = 0;
        this.animation.maxFrameIndex = data.frameOrder.length - 1;
        this.animation.frameOrder = data.frameOrder;
        this.animation.keyFrameTime = data.keyFrames[data.frameOrder[0]].length;
        if (!this.currentFrame) {
            this.currentFrame = this.type.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[this.animation.frameIndex]);
            this.nextFrame = this.type.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[this.animation.frameIndex + 1]);
            return;
        }
        this.nextFrame = this.type.getAnimationKeyFrame(this.animation.animation, this.animation.frameOrder[0]);
    }
    updatePixelPosition([x, y, z], [nx, ny, nz]) {
        const matrixIndex = this.type.getPixelMatrixIndex(x, y, z);
        if (matrixIndex === false)
            return;
        const i = matrixIndex * 16 + 12;
        this.matrix[i] = nx;
        this.matrix[i + 1] = ny;
        this.matrix[i + 2] = nz;
        let tx = Math.ceil(nx + this.location[1]);
        let ty = Math.ceil(ny + this.location[2]);
        let tz = Math.ceil(nz + this.location[3]);
        const position = this.lightMap.getValue(x, y, z).voxelPosition;
        if (position[0] == tx || position[1] == ty || position[2] == tz)
            return;
        position[0] = tx;
        position[1] = ty;
        position[2] = tz;
        let light = this.type._findBrightestLight(tx, ty, tz);
        //   if (light < 0) light = 0;
        if (light == 0)
            return;
        voxelShader.setLight(light).setAO(0).setAnimation(0);
        this.voxelData[matrixIndex] = voxelShader.getValue();
    }
}
