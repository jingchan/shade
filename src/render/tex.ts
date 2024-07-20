// // let cubeTexture: GPUTexture;
// // {
// //   const response = await fetch('../../assets/img/Di-3d.png');
// //   const imageBitmap = await createImageBitmap(await response.blob());

// //   cubeTexture = device.createTexture({
// //     size: [imageBitmap.width, imageBitmap.height, 1],
// //     format: 'rgba8unorm',
// //     usage:
// //       GPUTextureUsage.TEXTURE_BINDING |
// //       GPUTextureUsage.COPY_DST |
// //       GPUTextureUsage.RENDER_ATTACHMENT,
// //   });
// //   device.queue.copyExternalImageToTexture(
// //     { source: imageBitmap },
// //     { texture: cubeTexture },
// //     [imageBitmap.width, imageBitmap.height],
// //   );
// // }

// // import triangleVertWGSL from '../shaders/screen.vert.wgsl';
// // import colorFrag from '../shaders/color.frag.wgsl';
// import screenVertWGSL from '../shaders/screen.vert.wgsl';
// import { RenderSize, RendererContext, Renderer } from './renderer';

// const NUM_VERTICES = 4;

// export class ScreenRenderer implements Renderer {
//   private pipeline?: GPURenderPipeline;
//   private uniformBuffer?: GPUBuffer;
//   private renderSize?: RenderSize;
//   private uniformBindGroup?: GPUBindGroup;

//   constructor(private renderContext: RendererContext) {}

//   setup(renderSize: RenderSize) {
//     this.renderSize = renderSize;

//     const { pipeline, uniformBuffer, uniformBindGroup } = _createPipeline(
//       this.renderContext,
//       renderSize,
//     );
//     this.pipeline = pipeline;
//     this.uniformBuffer = uniformBuffer;
//     this.uniformBindGroup = uniformBindGroup;
//   }

//   update() {
//     if (!this.pipeline || !this.uniformBuffer || !this.renderSize) {
//       throw new Error(
//         'Renderer not initialized, need to call setup() before update().',
//       );
//     }

//     _updateUniforms(
//       this.renderContext.device,
//       this.uniformBuffer,
//       this.renderSize,
//     );
//   }

//   renderFrame(target: RenderTarget) {
//     if (!this.pipeline) {
//       throw new Error('Pipeline not created, need to call setup() first.');
//     }

//     // should be moved to shared.
//     const dstView = this.renderContext.context.getCurrentTexture().createView();

//     _sendCommands(
//       this.renderContext.device,
//       this.pipeline,
//       dstView,
//       this.uniformBindGroup!,
//     );
//   }
// }

// function _createPipeline(
//   renderContext: RendererContext,
//   renderSize: {
//     width: number;
//     height: number;
//   },
// ) {
//   const { device, presentationFormat } = renderContext;

//   const pipeline = device.createRenderPipeline({
//     label: 'screen-pipeline',
//     layout: 'auto',
//     vertex: {
//       module: device.createShaderModule({
//         code: screenVertWGSL,
//       }),
//     },
//     fragment: {
//       module: device.createShaderModule({
//         code: screenVertWGSL,
//       }),
//       targets: [
//         {
//           format: presentationFormat,
//         },
//       ],
//     },
//     primitive: {
//       topology: 'triangle-strip' as GPUPrimitiveTopology,
//       // topology: 'triangle-list',

//       // Backface culling since the cube is solid piece of geometry.
//       // Faces pointing away from the camera will be occluded by faces
//       // pointing toward the camera.
//       cullMode: 'back',
//     },
//   });

//   const uniformBufferSize = 4 * 4 * 3; // Colors
//   const uniformBuffer = device.createBuffer({
//     size: uniformBufferSize,
//     usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
//   });

//   const uniformBindGroup = device.createBindGroup({
//     label: 'uniform-bindgroup',
//     layout: pipeline.getBindGroupLayout(0),
//     entries: [
//       {
//         binding: 0,
//         resource: {
//           buffer: uniformBuffer,
//         },
//       },
//     ],
//   });

//   return {
//     pipeline,
//     uniformBuffer,
//     uniformBindGroup,
//   };
// }

// function _updateUniforms(
//   device: GPUDevice,
//   uniformBuffer: GPUBuffer,
//   renderSize: RenderSize,
// ) {
//   // prettier-ignore
//   const colors = new Float32Array([
//     1.0, 1.0, 0.0, 1.0, // red
//   ]);

//   device.queue.writeBuffer(
//     uniformBuffer,
//     0,
//     colors.buffer,
//     colors.byteOffset,
//     colors.byteLength,
//   );
// }

// function _sendCommands(
//   device: GPUDevice,
//   pipeline: GPURenderPipeline,
//   dstView: GPUTextureView,
//   uniformBindGroup: GPUBindGroup,
// ) {
//   const renderPassDescriptor: GPURenderPassDescriptor = {
//     colorAttachments: [
//       {
//         view: dstView,
//         clearValue: [0.5, 0.5, 0.5, 1.0],
//         loadOp: 'clear',
//         storeOp: 'store',
//       },
//       // {
//       //   view: cubeTexture.createView(),
//       //   loadValue: 'load',
//       //   storeOp: 'store',
//       // },
//     ],
//   };

//   const commandEncoder = device.createCommandEncoder();
//   const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
//   passEncoder.setPipeline(pipeline);
//   passEncoder.setBindGroup(0, uniformBindGroup);
//   passEncoder.draw(NUM_VERTICES);
//   passEncoder.end();
//   device.queue.submit([commandEncoder.finish()]);
// }
