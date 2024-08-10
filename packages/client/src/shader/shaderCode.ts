/**
 * Handles preprocessing of shader code prior to compiling into ShaderModule.
 */
import CommonWgsl from '../shaders/common.wgsl';
import base from '../shaders/base.wgsl';

export class ShaderCode {
  constructor(
    public userSource: string,
    public name?: string,
    public includeCommonLib = true,
  ) {}

  // Full source passed to WebGPU.
  get source() {
    const sources = [];
    if (this.includeCommonLib) {
      sources.push(CommonWgsl);
    }
    sources.push(this.userSource);
    return sources.join('\n');
  }

  static default() {
    return new ShaderCode(base, 'default');
  }
}

export default ShaderCode;
