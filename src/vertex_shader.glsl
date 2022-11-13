#version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_normal;
in vec3 a_uv;

uniform mediump float uPointSize;
uniform float uAngle;

void main() {
    gl_PointSize = uPointSize;
    //gl_Position = vec4(a_position, 1.0);
    gl_Position = vec4(
        cos(uAngle) * 0.8 + a_position.x,
        sin(uAngle) * 0.8 + a_position.y,
        a_position.z, 1.0
    );
}
