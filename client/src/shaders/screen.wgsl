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

  ret = alphaBlend(uniforms.color, ret);
  // ret = uniforms.color;
  // ret = alphaBlend(ret, uniforms.color);
  // ret.r = uniforms.color.r * uniforms.color.a + color.r * (1.0 - uniforms.color.a);
  // ret.g = uniforms.color.g * uniforms.color.a + color.g * (1.0 - uniforms.color.a);
  // ret.b = uniforms.color.b * uniforms.color.a + color.b * (1.0 - uniforms.color.a);

  return ret;
}
