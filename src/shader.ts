import CommonWgsl from './shaders/common.wgsl';
import baseShader from './shaders/base.wgsl';

export type ShaderType = Shader | string;
export class Shader {
  private _source: string;

  constructor(source: string) {
    this._source = source;
  }

  get source() {
    // Append the common.wgsl
    return CommonWgsl + this._source;
  }

  static default() {
    return new Shader(baseShader);
  }
}
