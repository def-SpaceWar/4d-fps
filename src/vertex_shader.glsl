#version 300 es
precision highp float;

in vec3 a_position;
layout(location=4) in float a_color;
uniform vec3 uColor[4];
out lowp vec4 color;

void main() {
    color = vec4(uColor[int(a_color)], 1.0);
    gl_Position = vec4(a_position, 1.0);
}
