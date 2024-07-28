// 0: integer hash
// 1: float hash (aliasing based) (don't do this unless you live in the year 2013)
// const METHOD = 0;

// // 0: cubic
// // 1: quintic
// const INTERPOLANT = 0;

// #if METHOD==0
// this hash is not production ready, please
// replace this by something better
fn hash( x : vec2f ) -> f32
{
  // if (METHOD == 0) {
  //   // 2D -> 1D
  //   int n = p.x*3 + p.y*113;

  //   // 1D hash by Hugo Elias
  //   n = (n << 13) ^ n;
  //   n = n * (n * n * 15731 + 789221) + 1376312589;
  //   return -1.0+2.0*float( n & 0x0fffffff)/float(0x0fffffff);
  // } else {
    let p  = 50.0 * fract( x * 0.3183099 + vec2(0.71,0.113));
    return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
  // }
}

fn interpolate(t : vec2f) -> vec2f{
  // if (INTERPOLANT == 0) {
  //   // Cubic
  //   return t * t * (3.0 - 2.0 * t);
  // } else {
    // Quintic
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  // }
}

fn noise( p: vec2f ) -> f32
{
    // if(METHOD==0){
    //   ivec2 i = ivec2(floor( p ));
    // } else {
      let i = floor( p );
    // }

    let f = fract( p );
    let u = interpolate(f);

    // if (METHOD == 0) {
      return mix( mix( hash(i + vec2(0.0, 0.0)),
                      hash(i + vec2(1.0, 0.0)), u.x),
                  mix( hash(i + vec2(0.0, 1.0)),
                      hash(i + vec2(1.0, 1.0)), u.x), u.y);
    // } else {
      // return mix( mix( hash( i + vec2(0.0,0.0) ),
      //                 hash( i + vec2(1.0,0.0) ), u.x),
      //             mix( hash( i + vec2(0.0,1.0) ),
      //                 hash( i + vec2(1.0,1.0) ), u.x), u.y);
    // }
}

// -----------------------------------------------

// fn mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
//   let p = fragCoord.xy / iResolution.xy;

// 	var uv = p*vec2(iResolution.x/iResolution.y,1.0) + iTime*0.25;

// 	var f = 0.0;

//   // left: value noise
// 	if( p.x<0.6 ) {
// 		f = noise( 32.0*uv );
// 	} else {
//     // right: fbm - fractal noise (4 octaves)
// 		uv *= 8.0;
//     let m = mat2x2(1.6, 1.2, -1.2, 1.6);
// 		f  = 0.5000 * noise(uv); uv = m * uv;
// 		f += 0.2500 * noise(uv); uv = m * uv;
// 		f += 0.1250 * noise(uv); uv = m * uv;
// 		f += 0.0625 * noise(uv); uv = m * uv;
// 	}

// 	f = 0.5 + 0.5 * f;

//   f *= smoothstep(0.0, 0.005, abs(p.x-0.6) );

// 	out= vec4( f, f, f, 1.0 );
// }

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
  // var noiseIndex = vec3(
  //   in.pos.x / 8,
  //   in.pos.y / 8,
  //   uniforms.time/1000);

  // var noise = perlin(noiseIndex);
  // var color = vec4f(noise, noise, noise, 1.0);

  // return color;
  let p = vec2(
    in.pos.x / uniforms.width,
    in.pos.y / uniforms.height,
  );

	var uv = p * vec2(uniforms.width/uniforms.height, 1.0) + uniforms.time/1000*0.25;

	var f = 0.0;

  // left: value noise
	if( p.x < 0.6 ) {
		f = noise( 32.0 * uv );
	} else {
    // right: fbm - fractal noise (4 octaves)
		uv *= 8.0;
    let m = mat2x2(1.6, 1.2, -1.2, 1.6);
		f  = 0.5000 * noise(uv); uv = m * uv;
		f += 0.2500 * noise(uv); uv = m * uv;
		f += 0.1250 * noise(uv); uv = m * uv;
		f += 0.0625 * noise(uv); uv = m * uv;
	}

	f = 0.5 + 0.5 * f;

  f *= smoothstep(0.0, 0.005, abs(p.x - 0.6));

	return vec4( f, f, f, 1.0 );
}

const VERTS : array<vec2f, 4> = array<vec2f, 4>(
  vec2(-1.0, -1.0), // Bottom-left
  vec2(1.0, -1.0),  // Bottom-right
  vec2(-1.0, 1.0),  // Top-left
  vec2(1.0, 1.0),   // Top-right
);
