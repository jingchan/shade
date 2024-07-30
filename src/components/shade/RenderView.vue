<script setup lang="ts">
import {
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  Ref,
  ref,
} from 'vue';
import {
  Renderer,
  RendererConstructor,
  RendererContext,
  setupWebGpuContext,
} from '../../render/renderer';
import { TriangleRenderer } from '../../render/triangle';
import { RenderTarget } from '../../render/rendertarget';
import { Size } from '../../types';
import { BaseRendererOptions } from '../../render/base';
import { ShaderCode } from '../../shader';

export interface CanvasViewOptions extends Partial<BaseRendererOptions> {
  image?: string;
  scale?: number;
}

interface Props {
  name?: string;
  rendererConstructor: RendererConstructor;
  options?: CanvasViewOptions;
  shader?: ShaderCode;
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  renderer: TriangleRenderer,
  options: undefined,
  shader: undefined,
});
defineEmits<{
  'shader:compile:failed': [ShaderCode, Error];
}>();

const canvasEl = ref<HTMLCanvasElement>();
const context = ref<RendererContext>();
const renderer = ref<Renderer>();
let frameHandle: number = 0;
let frameTime: number = 0;
let rendererNeedsUpdate = true;
let errored = false;

export interface SetupRenderingPipelineOptions {
  context: RendererContext;
  options?: CanvasViewOptions;
}
async function setupRenderingPipeline(
  context: RendererContext,
  _options?: CanvasViewOptions,
) {
  const texture = await (async () => {
    if (!props.options?.image) {
      return;
    }
    const image = new Image();
    image.src = props.options.image;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const bitmap = await createImageBitmap(image);
    const bitmapSize = new Size(bitmap.width, bitmap.height);
    const texture = context.device.createTexture({
      size: bitmapSize.as_array(true),
      // format: 'bgra8unorm' as GPUTextureFormat,
      format: 'rgba8unorm' as GPUTextureFormat,
      usage:
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING,
    });
    context.device.queue.copyExternalImageToTexture(
      { source: bitmap },
      { texture },
      bitmapSize.as_array(true),
    );
    return texture;
  })();

  // Create Renderer.
  return new props.rendererConstructor(context, {
    ...props.options,
    texture,
    fragmentShader: props.shader,
    vertexShader: props.shader,
  });
}

async function setupWebGpu(canvas: Ref<HTMLCanvasElement | undefined>) {
  if (!canvas.value) {
    throw new Error('No canvas element.');
  }

  context.value = context.value || (await setupWebGpuContext(canvas.value));
  renderer.value =
    renderer.value ||
    (await setupRenderingPipeline(context.value, props.options));
}

function resizeCanvasColorBuffer() {
  // Resize backing colorbuffer if canvas size changed.
  if (!canvasEl.value) {
    throw new Error('No canvas element.');
  }
  const { width, height } = canvasEl.value;
  if (!width || !height) {
    throw new Error('No canvas width or height.');
  }
  const scale = props.options?.scale || 1;
  const scaledWidth = canvasEl.value?.clientWidth / scale;
  const scaledHeight = canvasEl.value?.clientHeight / scale;
  if (
    canvasEl.value?.width !== scaledWidth ||
    canvasEl.value?.height !== scaledHeight
  ) {
    canvasEl.value.width = scaledWidth;
    canvasEl.value.height = scaledHeight;
  }
}

async function startAnimationLoop() {
  let lastTime = performance.now();
  async function frameLoop(time: DOMHighResTimeStamp) {
    if (
      !errored &&
      (rendererNeedsUpdate || !context.value || !renderer.value)
    ) {
      rendererNeedsUpdate = false;
      await setupWebGpu(canvasEl);
    }

    const deltaTime = time - lastTime;
    lastTime = time;
    frameTime += deltaTime;

    if (!canvasEl.value) {
      return;
    }

    // TODO: Only re-create when needed.  This creates a new depth every frame.
    try {
      const target = new RenderTarget(context.value!, true);

      renderer.value!.update(frameTime, target);
      renderer.value!.renderFrame(target);
    } catch (e) {
      errored = true;
      console.log(
        `Error (${props.name}): Caught error trying to get rendertarget.`,
        e,
      );
      context.value = undefined;
    }
    frameHandle = requestAnimationFrame(frameLoop);
  }
  frameHandle = requestAnimationFrame(frameLoop);
}
onMounted(async () => {
  resizeCanvasColorBuffer();
  startAnimationLoop();
});
onUpdated(async () => {
  rendererNeedsUpdate = true;
  startAnimationLoop();
});

onBeforeUpdate(() => {
  cancelAnimationFrame(frameHandle);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frameHandle);
});
</script>

<template>
  <div class="canvas-container">
    <canvas ref="canvasEl" class="canvas" />
  </div>
</template>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  /* aspect-ratio: 1 / 1; */
  height: 100%;
  /* width: 640px;
  height: 480px; */
}
.canvas {
  position: absolute;
  width: 100%;

  /* height: 100%; */
  aspect-ratio: 1 / 1;
}
</style>
