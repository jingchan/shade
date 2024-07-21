/**
 * Alpha blend mode.
 *
 * TODO: Should this be 1-(1-a)(1-b)?
 *
 * Bad impl:
 *   src.r * src.a + dst.r * dst.a / (src.a + dst.a),
 *   src.g * src.a + dst.g * dst.a / (src.a + dst.a),
 *   src.b * src.a + dst.b * dst.a / (src.a + dst.a),
 *   min(src.a + dst.a, 1.0)
 **/
@must_use
fn alphaBlend(
  src: vec4f,
  dst: vec4f
) -> vec4f {
  return vec4(
    (src.r * src.a + dst.r * dst.a) / (src.a + dst.a),
    (src.g * src.a + dst.g * dst.a) / (src.a + dst.a),
    (src.b * src.a + dst.b * dst.a) / (src.a + dst.a),

    min(src.a + dst.a, 1.0)
  );
}

@must_use
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
