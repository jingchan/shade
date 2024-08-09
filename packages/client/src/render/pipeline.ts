import { ShaderModule } from '../shader';
import { RenderTarget } from './rendertarget';

const NUM_VERTICES = 4;
const DEFAULT_COLOR = [0.0, 0.4, 0.7, 0.4];

export interface RenderPipelineOptions {
  layout?: GPUPipelineLayout;
  presentationFormat?: GPUTextureFormat;
  // uniforms?: string[];
}

export class RenderPipeline {
  /**
   * Prefer using createRenderPipelineAsync for async initialization..
   **/
  private constructor(
    private device: GPUDevice,
    private handle: GPURenderPipeline,
  ) {}

  /**
   * Creates a new render pipeline.
   *
   * Async constructor to use with `createRenderPipelineAsync()`.
   */
  static async build(
    device: GPUDevice,
    vertexShader: ShaderModule,
    fragmentShader: ShaderModule,
    options?: RenderPipelineOptions,
  ): Promise<RenderPipeline> {
    const handle = await device.createRenderPipelineAsync({
      vertex: {
        module: vertexShader.handle,
        // entryPoint: 'main',
        // constants: [],
        // buffers: [] as GPUVertexBufferLayout[],
      } as GPUVertexState,
      fragment: {
        module: fragmentShader.handle,
        // entryPoint: 'main',
        // constants: [],
        targets: [
          {
            format: options?.presentationFormat || 'bgra8unorm',
          },
        ],
      } as GPUFragmentState,
      primitive: {
        topology: 'triangle-strip' as GPUPrimitiveTopology,
        cullMode: 'back' as GPUCullMode,
      } as GPUPrimitiveState,
      // depthStencil?: GPUDepthStencilState;
      // multisample?: GPUMultisampleState;

      // BindGroups cannot be shared between 'auto' layout RenderPipelines.
      layout: options?.layout || 'auto',
    } as GPURenderPipelineDescriptor);
    return new RenderPipeline(device, handle);
  }

  /**
   * Temporarily put this into RenderPipeline, should be it's own class.
   */
  createUniforms() {
    const uniformBufferSize = 4 * (4 + 4); // Width, Height, Time, Color
    const uniformBuffer = this.device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBindGroup = this.device.createBindGroup({
      label: 'uniform-bindgroup',
      layout: this.handle.getBindGroupLayout(0),
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

  _updateUniforms(
    uniformBuffer: GPUBuffer,
    time: number,
    target: RenderTarget,
    options: { color?: number[] } = {},
  ) {
    const width = target.renderSize.width;
    const height = target.renderSize.height;
    const color = options.color || DEFAULT_COLOR;

    // prettier-ignore
    const uniforms = new Float32Array([
      width, height, time, 0.0,
      color[0], color[1], color[2], color[3],
    ]);

    this.device.queue.writeBuffer(
      uniformBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength,
    );
  }

  draw(
    time: number,
    target: RenderTarget,
    uniformBuffer: GPUBuffer,
    bindgroups: GPUBindGroup[],
    options: { color?: number[] } = {},
  ) {
    this._updateUniforms(uniformBuffer, time, target, options);
    this._sendCommands(target.colorTextureView, bindgroups);
  }

  _sendCommands(dstView: GPUTextureView, bindgroups: GPUBindGroup[]) {
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
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(this.handle);
    passEncoder.setBindGroup(0, bindgroups[0]);
    passEncoder.draw(NUM_VERTICES);
    passEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);
  }
}
