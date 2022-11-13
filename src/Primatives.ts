import { ATTR_POSITION_LOC, Mesh, NamedMesh } from "./webglsetup";

export namespace Primatives {
    export class GridAxis {
        static createMesh(gl: WebGL2RenderingContext, meshCache?: NamedMesh[]) {
            // [ xyz C ]
            const
                verts: number[] = [],
                size = 1.8,
                div = 10.0,
                step = size / div,
                half = size / 2;

            let p;
            for (let i = 0; i <= div; i++) {
                // Vertical Line
                p = -half + (i * step);
                verts.push(p); // x1
                verts.push(half); // y1
                verts.push(0); // z1
                verts.push(0); // C1

                verts.push(p); // x2
                verts.push(-half); // y2
                verts.push(0); // z2
                verts.push(1); // C2

                // Horizontal Line
                p = half - (i * step);
                verts.push(-half); // x1
                verts.push(p); // y1
                verts.push(0); // z1
                verts.push(0); // C1

                verts.push(half); // x2
                verts.push(p); // y2
                verts.push(0); // z2
                verts.push(1); // C2
            }

            // Green Line
            verts.push(half); // x1
            verts.push(half); // y1
            verts.push(0); // z1
            verts.push(2); // C1
            verts.push(-half); // x2
            verts.push(-half); // y2
            verts.push(0); // z2
            verts.push(2); // C2

            // Blue Line
            verts.push(half); // x1
            verts.push(-half); // y1
            verts.push(0); // z1
            verts.push(3); // C1
            verts.push(-half); // x2
            verts.push(half); // y2
            verts.push(0); // z2
            verts.push(3); // C2

            const
                attrColorLoc = 4, // hard coded in the fragment shader
                mesh: Mesh = { drawMode: gl.LINES, vao: gl.createVertexArray()! };

            mesh.vertexComponentLen = 4;
            mesh.vertexCount = verts.length / mesh.vertexComponentLen;

            // going to be 4 elements long
            const strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen;

            mesh.bufVertices = gl.createBuffer()!;
            gl.bindVertexArray(mesh.vao);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(ATTR_POSITION_LOC);
            gl.enableVertexAttribArray(attrColorLoc);

            // [ "xyz" C ]
            gl.vertexAttribPointer(
                ATTR_POSITION_LOC,
                3,
                gl.FLOAT,
                false,
                strideLen,
                0 // take first 3 elements
            );

            // [ xyz "C" ]
            gl.vertexAttribPointer(
                attrColorLoc,
                1,
                gl.FLOAT,
                false,
                strideLen,
                Float32Array.BYTES_PER_ELEMENT * 3 // move 3 elements and take the 4th element
            );

            // Cleanup
            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            if (meshCache) meshCache.push({ name: "grid", mesh });
            return mesh;
        }
    }
}
