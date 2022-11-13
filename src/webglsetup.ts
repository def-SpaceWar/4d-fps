// GL Constants
export const
    ATTR_POSITION_NAME = "a_position",
    ATTR_POSITION_LOC = 0,
    ATTR_NORMAL_NAME = "a_normal",
    ATTR_NORMAL_LOC = 1,
    ATTR_UV_NAME = "a_uv",
    ATTR_UV_LOC = 2;

// GL Helper Functions
const
    glClear = (gl: WebGL2RenderingContext) => () => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },

    glSetSize = (gl: WebGL2RenderingContext) => (w: number, h: number) => {
        gl.canvas.style.width = w + "px";
        gl.canvas.style.height = h + "px";
        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.viewport(0, 0, w, h);
    },

    glCreateArrayBuffer = (gl: WebGL2RenderingContext) => (floatArray: Float32Array, isStatic = true) => {
        const buf = gl.createBuffer()!;

        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, floatArray, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return buf;
    },

    glCreateMeshVAO = (gl: WebGL2RenderingContext) =>
    (
        name: string,
        arrayIdx?: number[] | undefined,
        arrayVertex?: number[] | undefined,
        arrayNormal?: number[] | undefined,
        arrayUV?: number[] | undefined,
        meshCache?: NamedMesh[] | undefined
    ): Mesh => {
        const drawMode = gl.TRIANGLES;
        const vao = gl.createVertexArray()!;
        gl.bindVertexArray(vao);

        let bufVertices: WebGLBuffer | undefined = undefined,
            vertexComponentLen: number | undefined = undefined,
            vertexCount: number | undefined = undefined;
        if (arrayVertex) {
            bufVertices = gl.createBuffer()!,
            vertexComponentLen = 3,
            vertexCount = arrayVertex.length / vertexComponentLen;
            gl.bindBuffer(gl.ARRAY_BUFFER, bufVertices);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayVertex), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(ATTR_POSITION_LOC);
            gl.vertexAttribPointer(ATTR_POSITION_LOC, 3, gl.FLOAT, false, 0, 0);
        }

        let bufNormals: WebGLBuffer | undefined = undefined;
        if (arrayNormal) {
            bufNormals = gl.createBuffer()!;
            gl.bindBuffer(gl.ARRAY_BUFFER, bufNormals);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayNormal), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(ATTR_NORMAL_LOC);
            gl.vertexAttribPointer(ATTR_NORMAL_LOC, 3, gl.FLOAT, false, 0, 0);
        }

        let bufUV: WebGLBuffer | undefined = undefined;
        if (arrayUV) {
            bufUV = gl.createBuffer()!;
            gl.bindBuffer(gl.ARRAY_BUFFER, bufUV);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayUV), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(ATTR_UV_LOC);
            gl.vertexAttribPointer(ATTR_UV_LOC, 2, gl.FLOAT, false, 0, 0);
        }

        let bufIndex: WebGLBuffer | undefined = undefined,
            indexCount: number | undefined = undefined;
        if (arrayIdx) {
            bufIndex = gl.createBuffer()!,
            indexCount = arrayIdx.length;
            gl.bindBuffer(gl.ARRAY_BUFFER, bufIndex);
            gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(arrayIdx), gl.STATIC_DRAW);
        }

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        const rtn: Mesh = {
            drawMode,
            vao,
            bufVertices,
            bufNormals,
            bufUV,
            vertexComponentLen,
            vertexCount,
            bufIndex,
            indexCount
        };

        if (meshCache) meshCache.push({ name, mesh: rtn });
        return rtn;
    };

export type Mesh = {
    drawMode: number,
    vao: WebGLVertexArrayObject,
    bufVertices?: WebGLBuffer,
    vertexComponentLen?: number,
    vertexCount?: number,
    bufNormals?: WebGLBuffer,
    bufUV?: WebGLBuffer,
    bufIndex?: WebGLBuffer,
    indexCount?: number
};

export type NamedMesh = {
    name: string,
    mesh: Mesh
}

export type GLInstanceValues = {
    gl: WebGL2RenderingContext,
    meshCache: NamedMesh[],
    clear: () => void,
    setSize: (w: number, h: number) => void,
    createArrayBuffer: (floatArray: Float32Array, isStatic?: boolean) => WebGLBuffer,
    createMeshVAO: (
        name: string,
        arrayIdx?: number[] | undefined,
        arrayVertex?: number[] | undefined,
        arrayNormal?: number[] | undefined,
        arrayUV?: number[] | undefined,
        meshCache?: NamedMesh[] | undefined
    ) => Mesh,
};

export const GLInstance = (): GLInstanceValues => {
    const gl = document.getElementsByTagName("canvas")[0].getContext("webgl2")!;
    if (!gl) { console.error("WebGL2 Context not available."); }
    gl.clearColor(0, 0, 0, 0);
    return {
        gl,
        meshCache: [],
        clear: glClear(gl),
        setSize: glSetSize(gl),
        createArrayBuffer: glCreateArrayBuffer(gl),
        createMeshVAO: glCreateMeshVAO(gl)
    };
};
