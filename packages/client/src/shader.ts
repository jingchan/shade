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
