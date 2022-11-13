import './style.css';

import { GLInstance } from "./webglsetup";
import { RenderLoop } from "./RenderLoop";
import { TestShader } from './Shader';
import { Modal } from './Modal';

const
    _data = GLInstance()!,
    gl = _data.gl,
    meshCache = _data.meshCache,
    clear = _data.clear,
    //createArrayBuffer = _data.createArrayBuffer,
    setSize = _data.setSize,
    createMesh = _data.createMeshVAO;

const
    uiCanvas = document.getElementsByTagName("canvas")[1]!,
    uiCtx = uiCanvas.getContext("2d")!;

uiCtx.strokeStyle="#f00";
uiCtx.font="bold 48px monospace";

const gShader = new TestShader(gl);
gShader.activate();

const mesh = createMesh(
    "dots",
    undefined,
    [
        0.0, 0.0, 0.0,
        0.1, 0.1, 0.0,
        0.1, -.1, 0.0,
        -.1, -.1, 0.0,
        -.1, 0.1, 0.0
    ],
    undefined,
    undefined,
    meshCache
);
mesh.drawMode = gl.POINTS;

const gModal = new Modal(mesh);

const fpsTimes: number[] = [];
for (let i = 0; i < 100; i++) fpsTimes.push(0);
const avgFps = () => {
    let sum = 0;
    for (let i = 0; i < fpsTimes.length; i++) sum += fpsTimes[i];
    return Math.round(sum/fpsTimes.length);
};

let uPointSize = 5;
const pointSizeStep = 1;

let uAngle = 0;
let angleStep = 0;
const angleStepStep = Math.PI/64;

const renderLoop = new RenderLoop((dt: number) => {
    clear();
    gShader.set(Math.sin((uPointSize += (pointSizeStep * dt)) + uAngle) * uPointSize + uPointSize * 2, uAngle += ((angleStep += angleStepStep * dt) * dt)).renderModal(gModal);

    uiCtx.clearRect(0,0,window.innerWidth,window.innerHeight);
    fpsTimes.shift()
    fpsTimes.push(renderLoop.fps);
    uiCtx.strokeText("FPS: " + avgFps(), 0, 48);
}, 0).start();

// Rainbow stuff that is put under lockdown
//let hue = 0;
//const rainbowColors = (dt: number) => {
//    hue += 144 * dt;
//    hue = hue % 360;
//    let r = 0.0,
//        g = 0.0,
//        b = 0.0;
//
//    const X = (1 - Math.abs((hue / 60) % 2 - 1));
//    if (hue < 60) {
//        r = 1;
//        g = X;
//    } else if (hue < 120) {
//        r = X;
//        g = 1;
//    } else if (hue < 180) {
//        g = 1;
//        b = X;
//    } else if (hue < 240) {
//        g = X;
//        b = 1;
//    } else if (hue < 300) {
//        r = X;
//        b = 1;
//    } else {
//        r = 1;
//        b = X;
//    }
//
//    return new Float32Array([r, g, b, 0]);
//}

// Setting Canvas Size(s)
(() => {
    setSize(window.innerWidth, window.innerHeight);
    uiCanvas.width = window.innerWidth;
    uiCanvas.height = window.innerHeight;
    window.onresize = () => {
        setSize(window.innerWidth, window.innerHeight);
        uiCanvas.width = window.innerWidth;
        uiCanvas.height = window.innerHeight;
    };
    clear();
})();
