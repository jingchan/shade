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

const MATERIAL_WEIGHTS: vec4f = vec4(0.3, 0.7, 0.5, 0.0);
const SPHERE_AMBIENT: vec4f = vec4(0.1, 0.3, 0.2, 1.0);
const SPHERE_ALBEDO: vec4f = vec4(1.0, 0.0, 0.0, 1.0);
const SPHERE_SPECULAR: vec4f = vec4(1.0, 0.0, 1.0, 1.0);

fn sdSphere(p: vec3f, center: vec3f, radius: f32) -> f32 {
  let dir = normalize(p-center);
  let phi = atan2(dir.y, length(dir.xz));
  let theta = atan2(dir.z, dir.x);

  let disp = (cos((theta+phi)*20) + 1.0)/70.0 - 0.3 + sin(theta*20)*cos(theta*30)/90.0;
  // let disp = 0.0;
  return length(p - center) - radius + disp;
}

const MAX_MARCHING_STEPS : i32 = 100;

fn ray_march(ro: vec3f, rd: vec3f) -> vec4f {
  var t = 0.0;
  for (var i = 0; i < MAX_MARCHING_STEPS; i = i + 1) {
    let p = ro + rd * t;

    // Calculate distance to closest object.
    let d = sdSphere(p, vec3(0.0), 0.4);

    if (d < 0.001) {
      let normal = compute_normal(p);
      // return vec3f(1.0, 0.0, 0.0);
      let ambient = SPHERE_AMBIENT;
      // let diffuse = SPHERE_ALBEDO * dot(normal, normalize(vec3(1.0, 1.0, 1.0)));
      // let specular = SPHERE_SPECULAR * dot(normal, normalize(vec3(1.0, 1.0, 1.0)));
      let diffuse = SPHERE_ALBEDO * dot(normal, normalize(vec3(1.0, 1.0, 1.0)));
      let reflected = reflect(rd, normal);
      let specular = SPHERE_SPECULAR * pow(max(dot(reflected, normalize(vec3(1.0, 1.0, 1.0))), 0.0), 64.0);


      // return MATERIAL_WEIGHTS[1] * diffuse;
      return vec4(
        MATERIAL_WEIGHTS.x * ambient.rgb
        + MATERIAL_WEIGHTS.y * diffuse.rgb
        + MATERIAL_WEIGHTS.z * specular.rgb
        , 1.0);
    }
    t = t + d;
  }
  return vec4f(vec3f(0.0), 1.0);
  // return vec4f(0.7, 0.7, 0.7, 1.0);
}

fn collide_world(p: vec3f) -> f32 {
  return sdSphere(p, vec3(0.0), 0.4);
}

fn compute_normal(p: vec3f) -> vec3f {
  let eps = 0.0001;
  let x = vec3(eps, 0.0, 0.0);
  let y = vec3(0.0, eps, 0.0);
  let z = vec3(0.0, 0.0, eps);

  return normalize(vec3(
    collide_world(p + x) - collide_world(p - x),
    collide_world(p + y) - collide_world(p - y),
    collide_world(p + z) - collide_world(p - z)
  ));
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


  let camera = vec3(0.0, 0.0, 4.0);

  let ro = camera;
  let rd = normalize(vec3(p, 0.0) - camera);

  // return vec4f(ray_march(ro, rd), 1.0);
  return ray_march(ro, rd);
}
