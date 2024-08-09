struct Uniforms {
  color: vec4f,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

@fragment
fn main(
  @location(0) pos: vec2f,
) -> @location(0) vec4f {

  var x = uniforms.color;
  var color = vec4f(
    pos.x/2.0 + 0.5,
    pos.y/2.0 + 0.5,
    0.0,
    1.0);

  color.r = uniforms.color.r * uniforms.color.a + color.r * (1.0 - uniforms.color.a);
  color.g = uniforms.color.g * uniforms.color.a + color.g * (1.0 - uniforms.color.a);
  color.b = uniforms.color.b * uniforms.color.a + color.b * (1.0 - uniforms.color.a);

  return color;
}
