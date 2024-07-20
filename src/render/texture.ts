/**
 * Renders a texture to a quad.
 */
import screenVertWGSL from '../shaders/texture.wgsl';
import {
  testPositionOffset,
  testUvOffset,
  testVertexArray,
  testVertexCount,
  testVertexSize,
} from './mesh/test';
import { RendererContext, Renderer } from './renderer';
import { RenderTarget } from './rendertarget';

const WAVE_PERIOD = 4000 / (2 * Math.PI);

export class TextureRenderer implements Renderer {
  private pipeline: GPURenderPipeline;
  private vertexBuffer: GPUBuffer;
  private numVertices: number;
  private uniformBuffer: GPUBuffer;
  private uniformBindGroup: GPUBindGroup;

  constructor(
    private renderContext: RendererContext,
    private texture: GPUTexture,
  ) {
    const {
      pipeline,
      vertexBuffer,
      numVertices,
      uniformBuffer,
      uniformBindGroup,
    } = _createPipeline(this.renderContext, texture);
    this.pipeline = pipeline;
    this.vertexBuffer = vertexBuffer;
    this.numVertices = numVertices;
    this.uniformBuffer = uniformBuffer;
    this.uniformBindGroup = uniformBindGroup;
  }

  update(time: number) {
    _updateUniforms(this.renderContext.device, this.uniformBuffer, time);
  }

  renderFrame(target: RenderTarget) {
    _sendCommands(
      this.renderContext.device,
      this.pipeline,
      target.colorTextureView,
      target.depthTextureView,
      this.texture.createView(),
      this.vertexBuffer,
      this.numVertices,
      this.uniformBindGroup!,
    );
  }
}

function _createPipeline(renderContext: RendererContext, texture: GPUTexture) {
  const { device, presentationFormat } = renderContext;

  const pipeline = device.createRenderPipeline({
    label: 'texture-pipeline',
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: screenVertWGSL,
      }),
      buffers: [
        {
          arrayStride: testVertexSize,
          attributes: [
            {
              shaderLocation: 0,
              format: 'float32x4',
              offset: testPositionOffset,
            },
            {
              shaderLocation: 1,
              format: 'float32x2',
              offset: testUvOffset,
            },
          ],
        } as GPUVertexBufferLayout,
      ],
    } as GPUVertexState,
    fragment: {
      module: device.createShaderModule({
        code: screenVertWGSL,
      }),
      targets: [
        {
          format: presentationFormat,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
      cullMode: 'back',
    },
    depthStencil: {
      format: 'depth24plus',
      depthWriteEnabled: true,
      depthCompare: 'less',
    },
  });

  const numVertices = testVertexCount;
  const vertexBufferSize = testVertexSize * numVertices;
  const vertexBuffer = device.createBuffer({
    size: vertexBufferSize,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  new Float32Array(vertexBuffer.getMappedRange()).set(testVertexArray);
  vertexBuffer.unmap();

  const uniformBufferSize = 4 * 3 * 4 + 4 * 4; // Mat + Color
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
  });

  console.log('texture', texture);

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
      {
        binding: 1,
        resource: texture.createView(),
      },
      {
        binding: 2,
        resource: sampler,
      },
    ],
  });

  return {
    pipeline,
    vertexBuffer,
    numVertices,
    uniformBuffer,
    uniformBindGroup,
  };
}

function _updateUniforms(
  device: GPUDevice,
  uniformBuffer: GPUBuffer,
  time: number,
) {
  const wave = Math.sin(time / WAVE_PERIOD) * 0.5 + 0.5;

  const theta = time / 1000;
  // prettier-ignore
  const uniforms = new Float32Array([
    // Matrix
    // 1.0, 0.0, 0.0, 0.0,
    // 0.0, 1.0, 0.0, 0.0,
    Math.cos(theta), Math.sin(theta), 0.0, 0.0,
    -Math.sin(theta), Math.cos(theta), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,

    // Color
    1.0, 0.0, 0.0, wave, // red
  ]);

  device.queue.writeBuffer(
    uniformBuffer,
    0,
    uniforms.buffer,
    uniforms.byteOffset,
    uniforms.byteLength,
  );
}

function _sendCommands(
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  dstView: GPUTextureView,
  depthView: GPUTextureView,
  textureView: GPUTextureView,
  vertexBuffer: GPUBuffer,
  numVertices: number,
  uniformBindGroup: GPUBindGroup,
) {
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: dstView,
        clearValue: [0.5, 0.5, 0.5, 1.0],
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthView,

      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  };

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, uniformBindGroup);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.draw(numVertices);
  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
}
