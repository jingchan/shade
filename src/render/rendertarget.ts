import { RendererContext, RenderSize } from './renderer';

export interface RenderTargetInterface {
  colorTextureView: GPUTextureView;
  depthTextureView: GPUTextureView;
}

export class RenderTarget {
  private depthTexture?: GPUTexture;

  constructor(
    public context: RendererContext,
    public has_depth?: boolean,
  ) {
    if (has_depth) {
      this.depthTexture = createDepthTexture(
        context.device,
        context.renderSize,
      );
    }
  }

  get colorTextureView() {
    return this.context.context.getCurrentTexture().createView();
  }
  get depthTextureView(): GPUTextureView {
    if (!this.depthTexture) {
      throw new Error('Depth texture not created');
    }
    return this.depthTexture.createView();
  }
}

export class TextureRenderTarget extends RenderTarget {
  public colorTexture: GPUTexture;
  constructor(
    public context: RendererContext,
    public has_depth?: boolean,
  ) {
    super(context, has_depth);
    this.colorTexture = context.device.createTexture({
      size: context.renderSize.as_array(),
      format: context.presentationFormat,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.COPY_SRC |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.TEXTURE_BINDING,
    });
  }

  get colorTextureView() {
    return this.colorTexture.createView();
  }
}

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
