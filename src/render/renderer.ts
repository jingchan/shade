import { Size } from '../types';
import { RenderTarget } from './rendertarget';

export type RenderSize = Size;

export interface Renderer {
  update(time: number): void;
  renderFrame(target: RenderTarget): void;
}

export interface RendererContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  devicePixelRatio: number;
  presentationFormat: GPUTextureFormat;
  renderSize: RenderSize;
}

export async function setupCanvasAndContext(
  canvas: HTMLCanvasElement,
): Promise<RendererContext> {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error('WebGPU not supported');
  }
  const device = await adapter?.requestDevice();
  if (!device) {
    throw new Error('WebGPU not supported');
  }
  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error('WebGPU not supported');
  }

  // const devicePixelRatio = window.devicePixelRatio;
  // canvas.width = canvas.clientWidth * devicePixelRatio;
  // canvas.height = canvas.clientHeight * devicePixelRatio;
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  if (!device) {
    throw new Error('WebGPU not supported');
  }
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'premultiplied' as GPUCanvasAlphaMode,
    // alphaMode: 'premultiplied',
  });

  const renderSize = new Size(canvas.width, canvas.height);

  return {
    device,
    adapter,
    context,
    devicePixelRatio,
    presentationFormat,
    renderSize,
  };
}
