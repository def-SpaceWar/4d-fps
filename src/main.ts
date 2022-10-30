import './style.css';

import { GLInstance, ShaderUtil } from './webglsetup';

const _data = GLInstance()!,
    gl = _data.gl,
    clear = _data.clear,
    setSize = _data.setSize;

//const WIDTH = gl.canvas.width;
//const HEIGHT = gl.canvas.height;

setSize(window.innerWidth, window.innerHeight);
window.onresize = () => { setSize(window.innerWidth, window.innerHeight); };
clear();

const shaderProgram = ShaderUtil.createProgram(gl)!;

gl.useProgram(shaderProgram);
const aPositionLocation = gl.getAttribLocation(shaderProgram, "a_position"),
    uPointSizeLocation = gl.getUniformLocation(shaderProgram, "uPointSize");
gl.useProgram(null);

const arrVerts = new Float32Array([0, 0, 0, 0.5, 0.5, 0.5]),
    bufVerts = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
gl.bufferData(gl.ARRAY_BUFFER, arrVerts, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

gl.useProgram(shaderProgram);
gl.uniform1f(uPointSizeLocation, 50.0);

gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
gl.enableVertexAttribArray(aPositionLocation);
gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

requestAnimationFrame(loop);
function loop() {
    clear();

    gl.drawArrays(gl.POINTS, 0, 2);

    requestAnimationFrame(loop);
};
