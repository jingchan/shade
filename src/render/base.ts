/**
 * Base Renderer class.
 */

import { Shader, ShaderType } from '../shader';
import type { Renderer } from './renderer';
import { RendererContext } from './renderer';
import { RenderTarget } from './rendertarget';

const NUM_VERTICES = 4;

const DEFAULT_COLOR = [0.0, 0.4, 0.7, 0.4];

export type ColorType = [number, number, number, number];
export interface BaseRendererOptions {
  vertexShader?: ShaderType;
  fragmentShader?: ShaderType;
  texture?: GPUTexture;
  color?: ColorType;
}

export class BaseRenderer implements Renderer {
  private pipeline: GPURenderPipeline;
  private uniformBuffer: GPUBuffer;
  private uniformBindGroup: GPUBindGroup;

  constructor(
    private renderContext: RendererContext,
    private options: BaseRendererOptions = {},
  ) {
    this.pipeline = this._initPipeline(options);
    const { uniformBuffer, uniformBindGroup } = this._initUniforms();

    this.uniformBuffer = uniformBuffer;
    this.uniformBindGroup = uniformBindGroup;
  }

  update(time: number, target: RenderTarget) {
    this._updateUniforms(time, target);
  }

  renderFrame(target: RenderTarget) {
    this._sendCommands(target.colorTextureView);
  }

  _initPipeline(options: BaseRendererOptions) {
    const { device, presentationFormat } = this.renderContext;

    function getShaderSource(shader?: ShaderType): string {
      if (!shader) {
        return Shader.default().source;
      }
      if (typeof shader === 'string') {
        return shader;
      }
      return shader.source;
    }
    const pipeline = device.createRenderPipeline({
      label: 'screen-pipeline',
      layout: 'auto',
      vertex: {
        module: device.createShaderModule({
          code: getShaderSource(options.vertexShader),
        }),
      },
      fragment: {
        module: device.createShaderModule({
          code: getShaderSource(options.fragmentShader),
        }),
        targets: [
          {
            format: presentationFormat,
          },
        ],
      },
      primitive: {
        topology: 'triangle-strip' as GPUPrimitiveTopology,
        cullMode: 'back' as GPUCullMode,
      },
    });

    return pipeline;
  }

  /**
   * Sets up uniforms for the renderer.
   */
  _initUniforms() {
    const { device } = this.renderContext;
    const uniformBufferSize = 4 * (4 + 4); // Width, Height, Time, Color
    const uniformBuffer = device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBindGroup = device.createBindGroup({
      label: 'uniform-bindgroup',
      layout: this.pipeline.getBindGroupLayout(0),
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
      uniformBuffer,
      uniformBindGroup,
    };
  }

  _updateUniforms(time: number, target: RenderTarget) {
    const { device } = this.renderContext;
    const width = target.renderSize.width;
    const height = target.renderSize.height;
    const color = this.options.color || DEFAULT_COLOR;

    // prettier-ignore
    const uniforms = new Float32Array([
      width, height, time, 0.0,
      color[0], color[1], color[2], color[3],
    ]);

    device.queue.writeBuffer(
      this.uniformBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength,
    );
  }

  _sendCommands(dstView: GPUTextureView) {
    const { device } = this.renderContext;
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

    const commandEncoder = this.renderContext.device.createCommandEncoder({
      label: 'base',
    });
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(this.pipeline);
    passEncoder.setBindGroup(0, this.uniformBindGroup);
    passEncoder.draw(NUM_VERTICES);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }
}
