// import "common.wgsl"

struct Uniforms {
  width: f32,
  height: f32,
  time: f32,
  color: vec4f,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) pos : vec4f,
  @location(0) p: vec2f,
}

const CHECKER_SIZE : f32 = 25.0;

@vertex
fn vs_main(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput {
  _ = uniforms.color;
  var output : VertexOutput;
  output.pos = vec4f(SCREEN_VERTS[VertexIndex], 0.0, 1.0);
  output.p = SCREEN_VERTS[VertexIndex];
  return output;
}

@fragment
fn fs_main(
  in: VertexOutput
) -> @location(0) vec4f {

  // Convert to 0-1 values with (0,0) at bottom left.
  var ret = vec4f(
    in.p.x/2.0 + 0.5,
    in.p.y/2.0 + 0.5,
    0.0,
    1.0);

  if ((floor(in.pos.x / CHECKER_SIZE) + floor(in.pos.y / CHECKER_SIZE)) % 2.0 > 0.0) {
    ret.r = 0.0;
    ret.g = 0.0;
    ret.b = 0.0;
  }

  ret = alphaBlend(uniforms.color, ret);

  return ret;
}
