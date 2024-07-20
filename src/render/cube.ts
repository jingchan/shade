import { mat4, vec3 } from 'wgpu-matrix';
import basicVertWGSL from '../shaders/ext/basic.vert.wgsl';
import vertexPositionColorWGSL from '../shaders/ext/vertexPositionColor.frag.wgsl';
import { RenderSize, RendererContext, Renderer } from './renderer';
import {
  cubeVertexArray,
  cubeVertexCount,
  cubeVertexSize,
  cubePositionOffset,
  cubeUVOffset,
} from './mesh/cube';
import { RenderTarget } from './rendertarget';

const MILLIS_PER_SEC = 1000.0;
const ROTATIONS_PER_SEC = 0.3;

export class CubeRenderer implements Renderer {
  private pipeline: GPURenderPipeline;
  private vertexBuffer: GPUBuffer;
  private uniformBuffer: GPUBuffer;
  private depthTexture: GPUTexture;
  private depthTextureView: GPUTextureView;
  private uniformBindGroup: GPUBindGroup;

  constructor(private renderContext: RendererContext) {
    const {
      pipeline,
      vertexBuffer,
      uniformBuffer,
      depthTexture,
      depthTextureView,
      uniformBindGroup,
    } = _createPipeline(this.renderContext);
    this.pipeline = pipeline;
    this.vertexBuffer = vertexBuffer;
    this.uniformBuffer = uniformBuffer;
    this.depthTexture = depthTexture;
    this.depthTextureView = depthTextureView;
    this.uniformBindGroup = uniformBindGroup;
  }

  update(time: number) {
    _updateUniforms(
      this.renderContext.device,
      this.uniformBuffer,
      this.renderContext.renderSize,
      time,
    );
  }

  renderFrame(target: RenderTarget) {
    _sendCommands(
      this.renderContext.device,
      this.pipeline,
      target.colorTextureView,
      target.depthTextureView,
      this.uniformBindGroup!,
      this.vertexBuffer!,
    );
  }
}

function _createPipeline(renderContext: RendererContext) {
  const { device, renderSize, presentationFormat } = renderContext;

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: basicVertWGSL,
      }),
      buffers: [
        {
          arrayStride: cubeVertexSize,
          attributes: [
            {
              // position
              shaderLocation: 0,
              offset: cubePositionOffset,
              format: 'float32x4',
            },
            {
              // uv
              shaderLocation: 1,
              offset: cubeUVOffset,
              format: 'float32x2',
            },
          ],
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({
        code: vertexPositionColorWGSL,
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
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  });

  const depthTexture = device.createTexture({
    size: [renderSize.width, renderSize.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
  const depthTextureView = depthTexture.createView();

  // Create a vertex buffer from the cube data.
  const vertexBuffer = device.createBuffer({
    size: cubeVertexArray.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  new Float32Array(vertexBuffer.getMappedRange()).set(cubeVertexArray);
  vertexBuffer.unmap();

  const uniformBufferSize = 4 * 16; // 4x4 matrix
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  return {
    pipeline,
    vertexBuffer,
    uniformBuffer,
    depthTexture,
    depthTextureView,
    uniformBindGroup,
  };
}

function getTransformationMatrix(renderSize: RenderSize, time: number = 0) {
  const aspect = renderSize.width / renderSize.height;
  const projectionMatrix = mat4.perspective(
    (2 * Math.PI) / 5,
    aspect,
    1,
    100.0,
  );

  const modelViewProjectionMatrix = mat4.create();
  const viewMatrix = mat4.identity();
  mat4.translate(viewMatrix, vec3.fromValues(0, 0, -4), viewMatrix);

  mat4.rotate(
    viewMatrix,
    // vec3.fromValues(Math.sin(now), Math.cos(now), 0),
    vec3.fromValues(0, 1, 0),
    ((2 * Math.PI * ROTATIONS_PER_SEC) / MILLIS_PER_SEC) * time,
    viewMatrix,
  );

  mat4.multiply(projectionMatrix, viewMatrix, modelViewProjectionMatrix);

  return modelViewProjectionMatrix;
}

function _updateUniforms(
  device: GPUDevice,
  uniformBuffer: GPUBuffer,
  renderSize: RenderSize,
  time: number,
) {
  const transformationMatrix = getTransformationMatrix(renderSize, time);
  device.queue.writeBuffer(
    uniformBuffer,
    0,
    transformationMatrix.buffer,
    transformationMatrix.byteOffset,
    transformationMatrix.byteLength,
  );
}

function _sendCommands(
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  dstView: GPUTextureView,
  depthView: GPUTextureView,
  uniformBindGroup: GPUBindGroup,
  vertexBuffer: GPUBuffer,
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
  passEncoder.draw(cubeVertexCount);
  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
}
