struct Uniforms {
  color: vec4f,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) Position : vec4f,
  @location(0) pos: vec2f,
}

@vertex
fn vs_main(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput{
  _ = uniforms.color;
  var output : VertexOutput;
  output.Position = vec4f(VERTS[VertexIndex], 0.0, 1.0);
  output.pos = VERTS[VertexIndex];
  return output;
}

@fragment
fn fs_main(
  @location(0) pos: vec2f,
) -> @location(0) vec4f {
  var color = vec4f(
    pos.x/2.0 + 0.5,
    pos.y/2.0 + 0.5,
    0.0,
    1.0);

  return color;
}

const VERTS : array<vec2f, 4> = array<vec2f, 4>(
  vec2(-1.0, -1.0), // Bottom-left
  vec2(1.0, -1.0),  // Bottom-right
  vec2(-1.0, 1.0),  // Top-left
  vec2(1.0, 1.0),   // Top-right
);
