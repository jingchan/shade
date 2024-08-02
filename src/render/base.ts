/**
 * Base Renderer class.
 */

import { ShaderCode, ShaderType } from '../shader';
import type { Renderer } from './renderer';
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
    private device: GPUDevice,
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
    // TODO: Make this a PArameter
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    function getShaderSource(shader?: ShaderType): string {
      if (!shader) {
        return ShaderCode.default().source;
      }
      if (typeof shader === 'string') {
        return shader;
      }
      return shader.source;
    }

    const vertexShaderModule = this.device.createShaderModule({
      code: getShaderSource(options.vertexShader),
    });
    vertexShaderModule.getCompilationInfo().then((info) => {
      console.log('compilationInfo', info);
    });
    // const fragmentShaderModule = this.device.createShaderModule({
    //   code: getShaderSource(options.vertexShader),
    // });

    const pipeline = this.device.createRenderPipeline({
      label: 'base-pipeline',
      layout: 'auto',
      vertex: {
        module: this.device.createShaderModule({
          code: getShaderSource(options.vertexShader),
        }),
      },
      fragment: {
        module: this.device.createShaderModule({
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
    const uniformBufferSize = 4 * (4 + 4); // Width, Height, Time, Color
    const uniformBuffer = this.device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBindGroup = this.device.createBindGroup({
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
    const width = target.renderSize.width;
    const height = target.renderSize.height;
    const color = this.options.color || DEFAULT_COLOR;

    // prettier-ignore
    const uniforms = new Float32Array([
      width, height, time, 0.0,
      color[0], color[1], color[2], color[3],
    ]);

    this.device.queue.writeBuffer(
      this.uniformBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength,
    );
  }

  _sendCommands(dstView: GPUTextureView) {
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

    const commandEncoder = this.device.createCommandEncoder({
      label: 'base',
    });
    const renderPassEncoder =
      commandEncoder.beginRenderPass(renderPassDescriptor);
    renderPassEncoder.setPipeline(this.pipeline);
    renderPassEncoder.setBindGroup(0, this.uniformBindGroup);
    renderPassEncoder.draw(NUM_VERTICES);
    renderPassEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);
  }
}
