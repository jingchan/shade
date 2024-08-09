// import { RendererContext, RenderSize } from './renderer';

// export class RenderSource {
//   constructor(
//     public context: RendererContext,
//     public renderSize: RenderSize,
//   ) {}

//   get colorTextureView() {
//     return this.context.context.getCurrentTexture().createView();
//   }
//   get depthTextureView(): GPUTextureView {
//     if (!this.depthTexture) {
//       throw new Error('Depth texture not created');
//     }
//     return this.depthTexture.createView();
//   }
// }

// export class TextureRenderTarget extends RenderTarget {
//   public colorTexture: GPUTexture;
//   constructor(
//     public context: RendererContext,
//     public renderSize: RenderSize,
//     public has_depth?: boolean,
//   ) {
//     super(context, renderSize, has_depth);
//     this.colorTexture = context.device.createTexture({
//       size: [renderSize.width, renderSize.height],
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

// function createDepthTexture(
//   device: GPUDevice,
//   renderSize: RenderSize,
// ): GPUTexture {
//   return device.createTexture({
//     size: [renderSize.width, renderSize.height],
//     format: 'depth24plus',
//     usage: GPUTextureUsage.RENDER_ATTACHMENT,
//   });
// }
