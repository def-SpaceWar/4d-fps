import { ATTR_NORMAL_LOC, ATTR_NORMAL_NAME, ATTR_POSITION_LOC, ATTR_POSITION_NAME, ATTR_UV_LOC, ATTR_UV_NAME } from './webglsetup';

export type ShaderAttributes = {
    position: number,
    normal: number,
    uv: number
};

export class ShaderUtil {
    static debugMode: boolean = true;

    static createShader(gl: WebGL2RenderingContext, src: string, type: number) {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling shader:\n" + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    static createProgram(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
        const program = gl.createProgram()!,
            vShader = this.createShader(gl, vertexShaderSource, gl.VERTEX_SHADER)!,
            fShader = this.createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)!;

        if (!fShader) (gl.deleteShader(vShader));

        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);

        gl.bindAttribLocation(program, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
        gl.bindAttribLocation(program, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
        gl.bindAttribLocation(program, ATTR_UV_LOC, ATTR_UV_NAME);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Error creating shader program.", gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        // debugging
        if (this.debugMode) {
            gl.validateProgram(program);
            if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                console.error("Error validating program.", gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }
        }

        gl.detachShader(program, vShader);
        gl.detachShader(program, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        return program;
    }

    static getStandardAttribLocations(gl: WebGL2RenderingContext, program: WebGLProgram) {
        return {
            position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
            normal: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
            uv: gl.getAttribLocation(program, ATTR_UV_NAME)
        }
    }
}
