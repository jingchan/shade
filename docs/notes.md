##### Scene

Bounds,
Entities,
Camera,

produces MVP matrices, managed by app, but referenced when updating unfiroms for the renderer.

CardDef

- Name
- Description
- Type
- Image

CardState

- Position
- Status

#### WGSL

https://www.w3.org/TR/WGSL/
https://github.com/PrismJS/prism/blob/master/components/prism-wgsl.js
https://github.com/brendan-duncan/wgsl_reflect/blob/main/src/wgsl_parser.ts
https://github.com/kach/nearley/blob/master/examples/classic_crontab.ne
https://shinylasers.com/playground

https://github.com/eliotbo/glsl2wgsl/blob/main/src/transpiler/ast.rs
https://github.com/alphastrata/shadplay

Source: https://www.reddit.com/r/rust_gamedev/comments/182gyhl/tour_of_wgsl_and_what_other_useful_resources_are/
Playgrounds:
Local: https://github.com/paulgb/wgsl-playground
Browser: https://shinylasers.com/playground
Shadertoy:
https://github.com/eliotbo/bevy_shadertoy_wgsl
https://github.com/alphastrata/shadplay
Christ Biscardi's videos: https://www.youtube.com/watch?v=02xuOcu_8tk
SDF impelmentations: https://gist.github.com/munrocket/f247155fc22ecb8edf974d905c677de1
Bevy game engine examples..
These are some of the resources I have found.

#### Web Editor

https://codesandbox.io/s/cm-editor-d4mzv

#### Shaders

https://www.reddit.com/r/Unity3D/comments/11mmhnm/made_a_huge_tutorial_on_how_to_make_stylized/
https://github.com/patriciogonzalezvivo/lygia/blob/main/morphological/alphaFill.glsl
https://iquilezles.org/articles/palettes/

SWR

#### Alerts

https://www.google.com/alerts

#version 300 es
precision mediump float;

out vec4 fragColor;

uniform float time;
uniform float width;
uniform float height;

float blendOverlay(float base, float blend) {
return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
return (blendOverlay(base, blend) _ opacity + base _ (1.0 - opacity));
}

vec3 brightnessContrast(vec3 value, float brightness, float contrast) {
return (value - 0.5) \* contrast + 0.5 + brightness;
}

float random(in vec2 st) {
return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) \* 43758.5453123);
}

vec3 mod289(vec3 x) { return x - floor(x _ (1.0 / 289.0)) _ 289.0; }

vec4 mod289(vec4 x) { return x - floor(x _ (1.0 / 289.0)) _ 289.0; }

vec4 permute(vec4 x) { return mod289(((x _ 34.0) + 1.0) _ x); }

vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 \* r; }

vec3 fade(vec3 t) { return t _ t _ t _ (t _ (t \* 6.0 - 15.0) + 10.0); }

float snoise(vec3 v){
const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
vec3 i = floor(v + dot(v, C.yyy) );
vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min( g.xyz, l.zxy );
vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C

vec3 x1 = x0 - i1 + 1.0 _ C.xxx;
vec3 x2 = x0 - i2 + 2.0 _ C.xxx;
vec3 x3 = x0 - 1. + 3.0 \* C.xxx;

// Permutations
i = mod(i, 289.0 );
vec4 p = permute( permute( permute(
i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
float n* = 1.0/7.0; // N=7
vec3 ns = n\* \* D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);

vec4 y* = floor(j - 7.0 \* x* ); // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;

vec4 y = y\_ \*ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );

vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;

vec4 s1 = floor(b1)\*2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;

vec4 a1 = b1.xzyw + s1.xzyw\*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);

vec3 p1 = vec3(a0.zw,h.y);
vec3 p2 = vec3(a1.xy,h.z);
vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
p0 _= norm.x;
p1 _= norm.y;
p2 _= norm.z;
p3 _= norm.w;

// Mix final noise value
vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m _ m;
return 42.0 _ dot( m\*m, vec4( dot(p0,x0), dot(p1,x1),
dot(p2,x2), dot(p3,x3) ) );
}

// https://iquilezles.org/www/articles/palettes/palettes.htm
vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
return a + b _ cos(6.4 _ (c \* t + d));
}

vec3 compose(in float t, in vec2 uv, in float index) {
float delta = 0.15;
float offset = delta \* index;

    vec3 color1 = vec3(0.45, 0.29, 0.45);

vec3 color2 = vec3(0.5, 0.3, 0.1);
vec3 color3 = vec3(1.0, 1.1, 1.1);
vec3 color4 = vec3(0.38, 0.25, 1.1);

    return palette(
    		snoise(vec3(uv.x, uv.y + sin(uv.x + offset * 1. + t) * 3., t) * 0.4) * 1.,

color1,
color2,
color3,
color4
);
}

void main() {
vec2 resolution = vec2(width, height);
// vec2 vUv = gl*FragCoord.xy / resolution.xy;
vec2 vUv = gl_FragCoord.xy / resolution.yx;
vec2 uv = vUv * 1.1;
float t = time \_ 0.32;

    float n =

snoise(vec3(uv.x - t _ 2., uv.y + sin(uv.x + 120.0 _ 1. + t) _ 3., t) _
0.4) \*
1.;

    vec3 color = palette(n, vec3(0.5, 0.29, 0.45), vec3(0.5, 0.3, 0.1),

vec3(1.0, 1.1, 1.1), vec3(0.35, 0.25, 1.1));

    vec2 st = gl_FragCoord.xy / resolution.xy;

st.x _= resolution.y / resolution.y;
float noise = random(st _ 1.0);

    vec3 color1 = vec3(0.45, 0.29, 0.45);

vec3 color2 = vec3(0.5, 0.3, 0.1);
vec3 color3 = vec3(1.0, 1.1, 1.1);
vec3 color4 = vec3(0.38, 0.25, 1.1);

    vec3[] x = vec3[] (
    		compose(t, uv, 1.0),

compose(t, uv, 2.0),
compose(t, uv, 3.0),
compose(t, uv, 4.0),
compose(t, uv, 5.0),
compose(t, uv, 6.0),
compose(t, uv, 7.0),
compose(t, uv, 8.0),
compose(t, uv, 9.0),
compose(t, uv, 10.0),
compose(t, uv, 11.0),
compose(t, uv, 12.0)
);

    	int k = int(vUv.x * 8.0);
    		vec3 p = x[k];

    	p = brightnessContrast(p, 0.0, 1.1);
    		p = vec3(p.r * 0.3 + p.g * 0.59 + p.b * 0.11);

    		fragColor = vec4(
      			blendOverlay(
      				p,
    				vec3(noise),
    				0.2
    			),
    			1.0
    		);

    	// fragColor = vec4(p, 1.0);
    }
