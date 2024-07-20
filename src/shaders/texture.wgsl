struct Uniforms {
  matrix: mat3x4f,
  color: vec4f,
}
@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var texture : texture_2d<f32>;
@group(0) @binding(2) var textureSampler : sampler;

struct VertexIn {
  @location(0) pos : vec4f,
  @location(1) uv  : vec2f
}
struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) pos: vec2f,
  @location(1) texCoord: vec2f
}

@vertex
fn vs_main(
  in: VertexIn
) -> VertexOut {
  _ = uniforms.color;
  var transformMat = mat3x3f(
    uniforms.matrix[0].xyz,
    uniforms.matrix[1].xyz,
    uniforms.matrix[2].xyz,
  );
  var transformed = vec4((transformMat * in.pos.xyw).xy, 0.0, 1.0);

  var out : VertexOut;
  out.position = transformed;
  out.pos = transformed.xy;
  out.texCoord = in.uv;
  return out;
}

fn alphaBlend(
  src: vec4f,
  dst: vec4f
) -> vec4f {
  return vec4(
    src.r * src.a + dst.r * dst.a / (src.a + dst.a),
    src.g * src.a + dst.g * dst.a / (src.a + dst.a),
    src.b * src.a + dst.b * dst.a / (src.a + dst.a),
    min(src.a + dst.a, 1.0)
  );
}

fn premultiplyAlpha(
  color: vec4f
) -> vec4f {
  return vec4(
    color.r * color.a,
    color.g * color.a,
    color.b * color.a,
    color.a
  );
}

@fragment
fn fs_main(
  in: VertexOut
) -> @location(0) vec4f {
  var out = textureSample(texture, textureSampler, in.texCoord);
  out = alphaBlend(uniforms.color, out);
  out = premultiplyAlpha(out);

  return out;
}
