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
  @location(0) p: vec2f,
}

@vertex
fn vs_main(
  @builtin(vertex_index) VertexIndex : u32
) -> VertexOutput{
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
  var ret = vec4(1.0);
  let p = in.p;

  let p1 = vec2(0.0, 0.5);
  let p2 = vec2(-0.3, -0.6);
  let p3 = vec2(0.6, -0.5);
  let r = sdRound(sdTriangle(p, p1, p2, p3), 0.1);
	return coloring(r);
}
