import vertexShaderSource from './vertex_shader.glsl?raw';
import fragmentShaderSource from './fragment_shader.glsl?raw';

export class ShaderUtil {
    private static createShader(gl: WebGL2RenderingContext, src: string, type: number) {
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

    public static createProgram(gl: WebGL2RenderingContext) {
        const program = gl.createProgram()!,
            vShader = this.createShader(gl, vertexShaderSource, gl.VERTEX_SHADER)!,
            fShader = this.createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)!;

        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Error creating shader program.", gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        // debugging
        if (true) {
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
}
