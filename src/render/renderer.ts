import { ShaderCode, ShaderModule } from '../shader';
import { Size } from '../types';
import { RenderPipeline } from './pipeline';
import { RenderTarget } from './rendertarget';

export type RenderSize = Size;

type IRendererConstructor<T extends Renderer> = new (...args: any[]) => T;
export type RendererConstructor = IRendererConstructor<Renderer>;

export interface Renderer {
  update(time: number, target: RenderTarget): void;
  renderFrame(target: RenderTarget): void;
}

/**
 * Handles all interaction between context (browser, canvas) for the rendering pipeline.
 */
export interface RendererContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  devicePixelRatio: number;
  presentationFormat: GPUTextureFormat;
}

const WebGpuNotSupportedError = new Error('WebGPU not supported');

export async function setupWebGpuContext(
  canvas: HTMLCanvasElement,
): Promise<RendererContext> {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw WebGpuNotSupportedError;
  }
  const device = await adapter?.requestDevice();
  if (!device) {
    throw WebGpuNotSupportedError;
  }
  const context = canvas.getContext('webgpu');
  if (!context) {
    throw WebGpuNotSupportedError;
  }

  // const devicePixelRatio = window.devicePixelRatio;
  // canvas.width = canvas.clientWidth * devicePixelRatio;
  // canvas.height = canvas.clientHeight * devicePixelRatio;
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  if (!device) {
    throw WebGpuNotSupportedError;
  }
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'premultiplied' as GPUCanvasAlphaMode,
  } as GPUCanvasConfiguration);

  return {
    device,
    adapter,
    context,
    devicePixelRatio,
    presentationFormat,
  };
}
/**
 * Central object for rendering orchestration.
 */
export class RenderingModule {
  /**
   * Prefer using `build` for async initialization.
   */
  constructor(private device: GPUDevice) {}

  /**
   * Async initialization of the rendering module.
   */
  async build() {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw WebGpuNotSupportedError;
    }
    // TODO: Only log/check these in debug situations.
    console.log(adapter.features);
    console.log(adapter.limits);
    console.log(adapter.info);
    console.log(adapter.isFallbackAdapter);

    const device = await adapter.requestDevice();
    if (!device) {
      throw WebGpuNotSupportedError;
    }
    return new RenderingModule(device);
  }

  getPreferredCanvasFormat() {
    return navigator.gpu.getPreferredCanvasFormat();
  }
  /**
   * Creates a shader module from the given code.
   */
  createShader(code: ShaderCode): ShaderModule {
    // TODO: Memoize if same code detected.
    return new ShaderModule(this.device, code);
  }

  destroy() {
    this.device.destroy();
  }

  /**
   * Creates a rendering pipeline.
   *
   * @param vertex The vertex ShaderModule.
   * @param fragment The fragment shader module, if not provided, vertex ShaderModule will be used.
   */
  async createRenderPipeline(
    vertex: ShaderModule,
    fragment?: ShaderModule,
  ): Promise<RenderPipeline> {
    if (!fragment) {
      fragment = vertex;
    }

    return RenderPipeline.build(this.device, vertex, fragment, {
      presentationFormat: this.getPreferredCanvasFormat(),
    });
  }
}
