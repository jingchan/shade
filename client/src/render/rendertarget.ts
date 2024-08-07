import { Size } from '../types';
import { RendererContext, RenderSize } from './renderer';

export interface RenderTargetInterface {
  colorTextureView: GPUTextureView;
  depthTextureView: GPUTextureView;
}

export class RenderTarget {
  public renderSize: RenderSize;
  public colorTextureView: GPUTextureView;
  private depthTexture?: GPUTexture;
  public depthTextureView?: GPUTextureView;

  constructor(
    public context: RendererContext,
    public has_depth?: boolean,
  ) {
    const currentTexture = this.context.context.getCurrentTexture();
    this.colorTextureView = currentTexture.createView();
    this.renderSize = new Size(currentTexture.width, currentTexture.height);

    if (this.renderSize.width === 0 || this.renderSize.height === 0) {
      throw new Error('Render size is 0');
    }
    if (this.has_depth) {
      this.depthTexture = createDepthTexture(
        this.context.device,
        this.renderSize,
      );
      this.depthTextureView = this.depthTexture.createView();
    }
  }
}

// export class TextureRenderTarget extends RenderTarget {
//   public colorTexture: GPUTexture;
//   constructor(
//     public context: RendererContext,
//     public has_depth?: boolean,
//   ) {
//     super(context, has_depth);
//     this.colorTexture = context.device.createTexture({
//       size: context.renderSize.as_array(),
//       format: context.presentationFormat,
//       usage:
//         GPUTextureUsage.RENDER_ATTACHMENT |
//         GPUTextureUsage.COPY_SRC |
//         GPUTextureUsage.COPY_DST |
//         GPUTextureUsage.TEXTURE_BINDING,
//     });
//   }

//   get colorTextureView() {
//     return this.colorTexture.createView();
//   }
// }

function createDepthTexture(
  device: GPUDevice,
  renderSize: RenderSize,
): GPUTexture {
  return device.createTexture({
    size: renderSize.as_array(),
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
}
