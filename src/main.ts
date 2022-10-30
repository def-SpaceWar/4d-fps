import './style.css';

import { GLInstance } from "./webglsetup";
import { ShaderUtil } from "./ShaderUtil";
import { RenderLoop } from "./RenderLoop";

const _data = GLInstance()!,
    gl = _data.gl,
    clear = _data.clear,
    createArrayBuffer = _data.createArrayBuffer,
    setSize = _data.setSize;

const uiCanvas = document.getElementsByTagName("canvas")[1]!;
const uiCtx = uiCanvas.getContext("2d")!;

setSize(window.innerWidth, window.innerHeight);
uiCanvas.width = window.innerWidth;
uiCanvas.height = window.innerHeight;
window.onresize = () => {
    setSize(window.innerWidth, window.innerHeight);
    uiCanvas.width = window.innerWidth;
    uiCanvas.height = window.innerHeight;
};
clear();

const shaderProgram = ShaderUtil.createProgram(gl)!;

gl.useProgram(shaderProgram);
const aPositionLocation = gl.getAttribLocation(shaderProgram, "a_position"),
    uPointSizeLocation = gl.getUniformLocation(shaderProgram, "uPointSize"),
    uAngleLocation = gl.getUniformLocation(shaderProgram, "uAngle");
gl.useProgram(null);

const arrVerts = new Float32Array([0, 0, 0]),
    glVertCount = arrVerts.length / 3;

gl.useProgram(shaderProgram);

gl.bindBuffer(gl.ARRAY_BUFFER, createArrayBuffer(arrVerts));
gl.enableVertexAttribArray(aPositionLocation);
gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const fpsTimes = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
];
function avgFps() {
    let sum = 0;

    for (let i = 0; i < fpsTimes.length; i++) {
        sum += fpsTimes[i];
    }

    return Math.floor(sum/fpsTimes.length);
}

let uPointSize = 50;
const pointSizeStep = 10;

let uAngle = 0;
const angleStep = Math.PI/2;

const renderLoop = new RenderLoop((dt: number) => {
    gl.uniform1f(uPointSizeLocation, Math.sin(uPointSize) * uPointSize + uPointSize * 2);
    gl.uniform1f(uAngleLocation, uAngle);
    clear();

    uPointSize += pointSizeStep * dt;
    uAngle += angleStep * dt;

    gl.drawArrays(gl.POINTS, 0, glVertCount);

    fpsTimes.shift()
    fpsTimes.push(renderLoop.fps);

    uiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    uiCtx.strokeStyle = "#f00";
    uiCtx.font = "bold 48px monospace";
    uiCtx.strokeText("FPS: " + avgFps(), 0, 48);
}, 0).start();
