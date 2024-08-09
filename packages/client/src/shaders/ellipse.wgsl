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
  var ret = vec4(1.0);
  let foci = array(
    vec2(0.2, 0.5),
    vec2(0.6, 0.5),
    vec2(0.7, 0.3),
  );
  let p = vec2(
    in.pos.x / uniforms.width,
    in.pos.y / uniforms.height,
  );

  var d = 0.0;
  for (var i = 0; i < 3; i = i + 1) {
    d = d + dist(p, foci[i]);
  }

	if( d < 0.4*3 ) {
		ret = vec4(0.5, 0.5, 0.5, 1.0);
  } else {
		ret = vec4(0.0);
  }

	return ret;
}

const VERTS : array<vec2f, 4> = array<vec2f, 4>(
  vec2(-1.0, -1.0), // Bottom-left
  vec2(1.0, -1.0),  // Bottom-right
  vec2(-1.0, 1.0),  // Top-left
  vec2(1.0, 1.0),   // Top-right
);
