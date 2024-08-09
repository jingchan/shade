/**
 * Alpha blend mode.
 * Note: Not premultiplied.
 **/
@must_use
fn alphaBlend(
  src: vec4f,
  dst: vec4f
) -> vec4f {
  let dst_a = dst.a * (1.0 - src.a);
  return vec4(
    (src.r * src.a + dst.r * dst_a) / (src.a + dst_a),
    (src.g * src.a + dst.g * dst_a) / (src.a + dst_a),
    (src.b * src.a + dst.b * dst_a) / (src.a + dst_a),
    (src.a + dst_a)
  );
}

/**
 * Alpha blend mode.
 * Note: Not premultiplied.
 **/
@must_use
fn alphaBlendOpaque(
  src: vec4f,
  dst: vec4f
) -> vec4f {
  let dst_a = dst.a * (1.0 - src.a);
  return vec4(
    (src.r * src.a + dst.r) / (src.a + 1.0),
    (src.g * src.a + dst.g) / (src.a + 1.0),
    (src.b * src.a + dst.b) / (src.a + 1.0),
    (src.a + 1.0)
  );
}

/**
 * Alpha blend mode.
 * Note: Not premultiplied.
 **/
@must_use
fn multiplyBlend(
  src: vec4f,
  dst: vec4f
) -> vec4f {
  return vec4(
    (src.r * dst.r * src.a + dst.r * dst.a) / (src.a + dst.a),
    (src.g * dst.g * src.a + dst.g * dst.a) / (src.a + dst.a),
    (src.b * dst.b * src.a + dst.b * dst.a) / (src.a + dst.a),
    dst.a
  );
}

@must_use
fn multiplyBlendOpaque(
  src: vec4f,
  dst: vec4f
) -> vec4f {
  return vec4(
    (src.r * dst.r * src.a + dst.r) / (src.a + 1.0),
    (src.g * dst.g * src.a + dst.g) / (src.a + 1.0),
    (src.b * dst.b * src.a + dst.b) / (src.a + 1.0),
    1.0
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

@must_use
fn dist(
  a: vec2f,
  b: vec2f
) -> f32 {
  return distance(a, b);
}

const EQ_THRESHOLD = 0.02;
const STRIPE_SIZE = 0.04;
const COLOR_EQ = vec4f(1.0, 1.0, 1.0, 1.0);
const COLOR_IN_1 = vec4f(0.9, 0.6, 0.9, 1.0);
const COLOR_IN_2 = vec4f(1.0, 0.7, 1.0, 1.0);
const COLOR_OUT_1 = vec4f(0.6, 0.6, 1.0, 1.0);
const COLOR_OUT_2 = vec4f(0.6, 0.7, 0.9, 1.0);
const PI_2: f32 = 6.28318530718;

fn wave_fn(
  t: f32,
  period: f32
) -> f32 {
  var ret = cos(t/period*PI_2*2.0);
  return ret*ret;
}

@must_use
fn coloring(v: f32) -> vec4f {
  var ret: vec4f = vec4f(1.0);
  let a = max(0.0, abs(v) - EQ_THRESHOLD);
	if( v < 0.0 ) {
    ret = mix(COLOR_IN_1, COLOR_IN_2, wave_fn(a, 0.2));
  } else {
    ret = mix(COLOR_OUT_1, COLOR_OUT_2, wave_fn(a, 0.2));
  }

  ret = multiplyBlendOpaque(vec4f(vec3f(0.0), exp(-8*a)), ret);
  // ret = multiplyBlendOpaque(vec4f(vec3f(1.0), 0.8), ret);
  // ret = vec4f(ret.rgb * , ret.a);
  // ret = vec4f(ret.rgb * 1.0, ret.a);

  ret = alphaBlendOpaque(vec4f(COLOR_EQ.rgb, 1.0-smoothstep(0.004, 0.01, abs(v))), ret);
  return ret;
}

fn sdCircle(p: vec2f, r: f32) -> f32 {
  return length(p)-r;
}

fn sdBox(p: vec2f, b: vec2f) -> f32 {
  let d = abs(p)-b;
  return min(max(d.x, d.y), 0) +  length(max(d, vec2f(0)));
}

fn cross2d(a: vec2f, b: vec2f) -> f32 {
  return a.x*b.y - a.y*b.x;
}

fn sdRoundedBox(p: vec2f, b: vec2f, r: vec4f) -> f32 {
  var s = r;
  if (p.x < 0.0) {
    s.x = s.z;
    s.y = s.w;
  }
  if (p.y < 0.0) {
    s.x = s.y;
  }

  let d = abs(p) + s.x - b;
  if(d.x > 0.0 && d.y > 0.0) {
    return length(d)  - s.x;
  }

  return max(d.x, d.y) - s.x;
}

fn sdTriangle(p: vec2f, p1: vec2f, p2: vec2f, p3: vec2f) -> f32 {
  let normalized = array<vec2f, 3>(
    normalize(p2-p1),
    normalize(p3-p2),
    normalize(p1-p3)
  );
  let dists = array<f32, 3>(
    cross2d(p-p1, normalized[0]),
    cross2d(p-p2, normalized[1]),
    cross2d(p-p3, normalized[2])
  );

  var ret = max(max(dists[0], dists[1]), dists[2]);

  if (dists[0] > 0) {
    return sdLine(p, p1, p2);
  } else if (dists[1] > 0) {
    return sdLine(p, p2, p3);
  } else if (dists[2] > 0) {
    return sdLine(p, p3, p1);
  }

  return ret;
}

fn sdLine(p: vec2f, a: vec2f, b: vec2f) -> f32 {
  let pa = p - a;
  let ba = b - a;
  let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba*h);
}

// Rounding edges
fn sdRound( p: f32, r: f32 ) -> f32 {
  return p - r;
}

const SCREEN_VERTS: array<vec2f, 4> = array<vec2f, 4>(
  vec2(-1.0, -1.0), // Bottom-left
  vec2(1.0, -1.0),  // Bottom-right
  vec2(-1.0, 1.0),  // Top-left
  vec2(1.0, 1.0),   // Top-right
);


// sqrt(x*x + y*y) - r = 0
// df/dx = 1;
// df/dy = 1;
