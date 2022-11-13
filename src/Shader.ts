import { Modal } from "./Modal";
import { ShaderAttributes, ShaderUtil } from "./ShaderUtil";

export class Shader {
    program: WebGLProgram;
    attribLoc: ShaderAttributes;

    constructor(public gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
        this.program = ShaderUtil.createProgram(gl, vertexShaderSource, fragmentShaderSource)!;
        this.attribLoc = ShaderUtil.getStandardAttribLocations(this.gl, this.program);
        //this.uniformLoc = {};
    }

    activate() {
        this.gl.useProgram(this.program);
        return this;
    }

    deactivate() {
        this.gl.useProgram(null);
        return this;
    }

    dispose() {
        if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) == this.program) {
            this.gl.useProgram(null);
        }
        this.gl.deleteProgram(this.program);
    }

    preRender() {
        //
    }

    renderModal(modal: Modal) {
        this.gl.bindVertexArray(modal.mesh.vao);

        if (modal.mesh.indexCount)
            this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
        else if (modal.mesh.vertexCount)
            this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vertexCount);
        else {
            console.debug("Nothing to draw.");
            console.debug(modal);
        }

        this.gl.bindVertexArray(null);

        return this;
    }
}

import vertexShaderSource from './vertex_shader.glsl?raw';
import fragmentShaderSource from './fragment_shader.glsl?raw';
export class TestShader extends Shader { constructor(gl: WebGL2RenderingContext, arrayColor: number[]) {
        super(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(this.program);
        const uColor = gl.getUniformLocation(this.program, "uColor");
        gl.uniform3fv(uColor, arrayColor);
        gl.useProgram(null);
    }
}
