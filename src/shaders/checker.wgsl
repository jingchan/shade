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
  var color = vec4f(
    in.pos.x/uniforms.width,
    in.pos.y/uniforms.height,
    0.0,
    1.0);

  if ((floor(in.pos.x / CHECKER_SIZE) + floor(in.pos.y / CHECKER_SIZE)) % 2.0 > 0.0) {
    color.r = 0.0;
    color.g = 0.0;
    color.b = 0.0;
  }

  color.r = uniforms.color.r * uniforms.color.a + color.r * (1.0 - uniforms.color.a);
  color.g = uniforms.color.g * uniforms.color.a + color.g * (1.0 - uniforms.color.a);
  color.b = uniforms.color.b * uniforms.color.a + color.b * (1.0 - uniforms.color.a);

  return color;
}

const VERTS : array<vec2f, 4> = array<vec2f, 4>(
  vec2(-1.0, -1.0), // Bottom-left
  vec2(1.0, -1.0),  // Bottom-right
  vec2(-1.0, 1.0),  // Top-left
  vec2(1.0, 1.0),   // Top-right
);
