const PERM_ARRAY = array(
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
  36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
  75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
  149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
  27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
  92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
  209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
  164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
  147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
  28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
  155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
  191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
  181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
  61, 156, 180);


const g = array<vec3f, 16>(
  vec3(1,  1, 0),
  vec3(-1, 1,  0),
  vec3(1, -1, 0),
  vec3(-1, -1, 0),
  vec3(1,  0, 1),
  vec3(-1, 0,  1),
  vec3(1,  0,  -1),
  vec3(-1, 0, -1),
  vec3(0,  1,  1),
  vec3(0, -1, 1),
  vec3(0,  1, -1),
  vec3(0, -1, -1),
  vec3(1,  1,  0),
  vec3(0,  -1, 1),
  vec3(-1, 1, 0),
  vec3(0, -1, -1));



// smoothstep: return t * t * (3 - 2 * t); // old curve
@must_use
fn fade(t: f32) -> f32 {
  return t * t * t * (t * (t * 6 - 15) + 10); // new curve
  // return t * t * (3 - 2 * t); // old curve
  // return smoothstep(0, 1,t); // old curve
}


// public static double grad(int hash, double x, double y, double z) {
//     int h = hash & 15;                                    // Take the hashed value and take the first 4 bits of it (15 == 0b1111)
//     double u = h < 8 /* 0b1000 */ ? x : y;                // If the most significant bit (MSB) of the hash is 0 then set u = x.  Otherwise y.
//     double v;                                             // In Ken Perlin's original implementation this was another conditional operator (?:).  I
//                                                           // expanded it for readability.
//     if(h < 4 /* 0b0100 */)                                // If the first and second significant bits are 0 set v = y
//         v = y;
//     else if(h == 12 /* 0b1100 */ || h == 14 /* 0b1110*/)  // If the first and second significant bits are 1 set v = x
//         v = x;
//     else                                                  // If the first and second significant bits are not equal (0/1, 1/0) set v = z
//         v = z;
//     return ((h&1) == 0 ? u : -u)+((h&2) == 0 ? v : -v); // Use the last 2 bits to decide if u and v are positive or negative.  Then return their addition.
// }

fn perm(x: i32) -> i32 {
  return PERM_ARRAY[x & 255];
}

fn grad(hash: i32, x: vec3f) -> f32 {
  return dot(g[hash % 15], x);
}

fn perlin(v: vec3f) -> f32 {
  let vi = vec3i(v) & vec3i(255);
  let vf = v - vec3f(vec3i(v));
  let v_fade = vec3(fade(vf.x), fade(vf.y), fade(vf.z));

  let A = perm(vi.x) + vi.y;
  let AA = perm(A) + vi.z;
  let AB = perm(A + 1) + vi.z;
  let B = perm(vi.x + 1) + vi.y;
  let BA = perm(B) + vi.z;
  let BB = perm(B + 1) + vi.z;

  return mix(
    mix(
      mix(grad(perm(AA), vf),
          grad(perm(BA), vf + vec3f(-1, 0, 0)),
          v_fade.x),
      mix(grad(perm(AB), vf + vec3f(0, -1, 0)),
          grad(perm(BB), vf + vec3f(-1, -1, 0)),
          v_fade.x),
      v_fade.y),
    mix(
      mix(grad(perm(AA + 1), vf + vec3f(0, 0, -1)),
          grad(perm(BA + 1), vf + vec3f(-1, 0, -1)),
          v_fade.x),
      mix(grad(perm(AB + 1), vf + vec3f(0, -1, -1)),
          grad(perm(BB + 1), vf + vec3f(-1, -1, -1)),
          v_fade.x),
      v_fade.y),
    v_fade.z);
}

struct Uniforms {
  width: f32,
  height: f32,
  time: f32,
  color: vec4f,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

const CHECKER_SIZE : f32 = 25.0;

struct VertexOutput {
  @builtin(position) pos : vec4f,
}

@vertex
fn vs_main(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput{
  _ = uniforms.color;
  var output : VertexOutput;
  output.pos = vec4f(VERTS[VertexIndex], 0.0, 1.0);
  return output;
}

@fragment
fn fs_main(
  in: VertexOutput
) -> @location(0) vec4f {

  // Convert to 0-1 values with (0,0) at bottom left.
  // var color = vec4f(
  //   in.pos.x/uniforms.width,
  //   in.pos.y/uniforms.height,
  //   0.0,
  //   1.0);


  var noiseIndex = vec3(
    in.pos.x / 8,
    in.pos.y / 8,
    uniforms.time/1000);

  var noise = perlin(noiseIndex);
  var color = vec4f(noise, noise, noise, 1.0);

  // color.r = uniforms.color.r * uniforms.color.a + color.r * (1.0 - uniforms.color.a);
  // color.g = uniforms.color.g * uniforms.color.a + color.g * (1.0 - uniforms.color.a);
  // color.b = uniforms.color.b * uniforms.color.a + color.b * (1.0 - uniforms.color.a);
  // color = alphaBlend(uniforms.color, color);

  return color;
}

const VERTS : array<vec2f, 4> = array<vec2f, 4>(
  vec2(-1.0, -1.0), // Bottom-left
  vec2(1.0, -1.0),  // Bottom-right
  vec2(-1.0, 1.0),  // Top-left
  vec2(1.0, 1.0),   // Top-right
);
