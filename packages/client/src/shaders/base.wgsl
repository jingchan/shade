// #import "common.wgsl"

// Comment
struct Uniforms {
  width: f32,
  height: f32,
  time: f32,
  color: vec4f,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) pos : vec4f,
}

@vertex
fn vs_main(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput{
  var output : VertexOutput;
  output.pos = vec4f(SCREEN_VERTS[VertexIndex], 0.0, 1.0);
  return output;
}

@fragment
fn fs_main(
  in: VertexOutput
) -> @location(0) vec4f {

  // Convert to 0-1 values with (0,0) at bottom left.
  var color = vec4f(
    in.pos.x/uniforms.width,
    in.pos.y/uniforms.height,
    0.0,
    1.0);

  // color.r = uniforms.color.r * uniforms.color.a + color.r * (1.0 - uniforms.color.a);
  // color.g = uniforms.color.g * uniforms.color.a + color.g * (1.0 - uniforms.color.a);
  // color.b = uniforms.color.b * uniforms.color.a + color.b * (1.0 - uniforms.color.a);
  color = alphaBlend(uniforms.color, color);

  return color;
}
