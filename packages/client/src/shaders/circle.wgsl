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
  output.pos = vec4f(VERTS[VertexIndex], 0.0, 1.0);
  output.p = VERTS[VertexIndex];
  return output;
}

@fragment
fn fs_main(
  in: VertexOutput
) -> @location(0) vec4f {
  var ret = vec4(1.0);
  let p = in.p;

  let r = sdCircle(p, 0.56);
	return coloring(r);
}

const VERTS : array<vec2f, 4> = array<vec2f, 4>(
  vec2(-1.0, -1.0), // Bottom-left
  vec2(1.0, -1.0),  // Bottom-right
  vec2(-1.0, 1.0),  // Top-left
  vec2(1.0, 1.0),   // Top-right
);
