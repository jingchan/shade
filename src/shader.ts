import CommonWgsl from './shaders/common.wgsl';
import base from './shaders/base.wgsl';
import box from './shaders/box.wgsl';
import checker from './shaders/checker.wgsl';
import circle from './shaders/circle.wgsl';
import ellipse from './shaders/ellipse.wgsl';
import line from './shaders/line.wgsl';
import march from './shaders/march.wgsl';
import noise from './shaders/noise.wgsl';
import perlin from './shaders/perlin.wgsl';
import roundedBox from './shaders/roundedBox.wgsl';
import roundedTri from './shaders/roundedTri.wgsl';
import tri from './shaders/tri.wgsl';

export type ShaderType = ShaderCode | string;
export class ShaderCode {
  private _source: string;

  constructor(
    source: string,
    public name?: string,
    private includeCommonLib = true,
  ) {
    this._source = source;
  }

  // Excludes common module.
  get userSource() {
    return this._source;
  }

  // Full source passed to WebGPU.
  get source() {
    // Append the common.wgsl

    return this._sources().join('\n');
  }

  _sources() {
    const sources: string[] = [];
    if (this.includeCommonLib) {
      sources.push(CommonWgsl);
    }
    sources.push(this._source);
    return sources;
  }

  static default() {
    return new ShaderCode(base, 'default');
  }
}

/**
 * Represents a shader that can be used in creating a rendering pipeline.
 * Couled to GPUDevice.
 */
export class ShaderModule {
  public handle: GPUShaderModule;

  constructor(device: GPUDevice, code: ShaderCode) {
    this.handle = device.createShaderModule({
      code: code.source,
      // TODO: Generate sourcemap.
      // sourceMap: undefined,
      // TODO: Support compilation hints.
      // compilationHints: [] as Array<GPUShaderModuleCompilationHint>,
    } as GPUShaderModuleDescriptor);
  }
}

export const SHADERS: {
  [key: string]: string;
} = {
  checker,
  base,
  perlin,
  noise,
  circle,
  ellipse,
  march,
  tri,
  roundedTri,
  line,
  box,
  roundedBox,
};

export const DEFAULT_SHADER_CODE = `// Shader code here
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
`;
