import { Size } from '../types';
import { RenderTarget } from './rendertarget';

export type RenderSize = Size;

export interface Renderer {
  update(time: number, target: RenderTarget): void;
  renderFrame(target: RenderTarget): void;
}

export interface RendererContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  devicePixelRatio: number;
  presentationFormat: GPUTextureFormat;
}

const WebGpuNotSupportedError = new Error('WebGPU not supported');

export async function setupCanvasAndContext(
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
