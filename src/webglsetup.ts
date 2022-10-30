const glClear = (gl: WebGL2RenderingContext) => () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

const glSetSize = (gl: WebGL2RenderingContext) => (w: number, h: number) => {
    gl.canvas.style.width = w + "px";
    gl.canvas.style.height = h + "px";
    gl.canvas.width = w;
    gl.canvas.height = h;
    gl.viewport(0, 0, w, h);
};

const createArrayBuffer = (gl: WebGL2RenderingContext) => (floatArray: Float32Array, isStatic = true) => {
    const buf = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, floatArray, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return buf;
};

export const GLInstance = () => {
    const gl = document.getElementsByTagName("canvas")[0].getContext("webgl2");
    if (!gl) { console.error("WebGL2 Context not available."); return null; }
    gl.clearColor(0.5, 0.5, 0.5, 1);
    return {gl, clear: glClear(gl), setSize: glSetSize(gl), createArrayBuffer: createArrayBuffer(gl)};
};
