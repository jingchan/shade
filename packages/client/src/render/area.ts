/**
 * Renderer that positions based on pixel coordinates.
 */

import screenVertWGSL from '../shaders/screen.wgsl';
import { RendererContext, Renderer } from './renderer';
import { RenderTarget } from './rendertarget';

const NUM_VERTICES = 4;
const WAVE_PERIOD = 3000;

export class ScreenRenderer implements Renderer {
  private pipeline: GPURenderPipeline;
  private uniformBuffer: GPUBuffer;
  private uniformBindGroup: GPUBindGroup;

  constructor(private renderContext: RendererContext) {
    const { pipeline, uniformBuffer, uniformBindGroup } = _createPipeline(
      this.renderContext,
    );
    this.pipeline = pipeline;
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
      this.uniformBindGroup!,
    );
  }
}

function _createPipeline(renderContext: RendererContext) {
  const { device, presentationFormat } = renderContext;

  const pipeline = device.createRenderPipeline({
    label: 'area-pipeline',
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: screenVertWGSL,
      }),
    },
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
      topology: 'triangle-strip',
      cullMode: 'back',
    },
  });

  const uniformBufferSize = 4 * 4 * 3; // Colors
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const uniformBindGroup = device.createBindGroup({
    label: 'uniform-bindgroup',
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
    uniformBuffer,
    uniformBindGroup,
  };
}

function _updateUniforms(
  device: GPUDevice,
  uniformBuffer: GPUBuffer,
  time: number,
) {
  const wave = Math.sin((time / WAVE_PERIOD) * 2 * Math.PI) * 0.5 + 0.5;

  // prettier-ignore
  const colors = new Float32Array([
    0.0, 0.0, 1.0, 0.8*wave, // red
  ]);

  device.queue.writeBuffer(
    uniformBuffer,
    0,
    colors.buffer,
    colors.byteOffset,
    colors.byteLength,
  );
}

function _sendCommands(
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  dstView: GPUTextureView,
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
  };

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, uniformBindGroup);
  passEncoder.draw(NUM_VERTICES);
  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
}
