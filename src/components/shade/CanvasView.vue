<script setup lang="ts">
import {
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
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

export interface CanvasViewOptions extends Partial<BaseRendererOptions> {
  image?: string;
  scale?: number;
}

interface Props {
  name?: string;
  rendererConstructor: RendererConstructor;
  options?: CanvasViewOptions;
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  rendererConstructor: TriangleRenderer,
  options: undefined,
});

const canvasEl = ref<HTMLCanvasElement>();
let context: RendererContext | null = null;
let renderer: Renderer | null = null;
let frameHandle: number = 0;
let frameTime: number = 0;

async function setupContext() {
  const canvas = canvasEl.value!;
  if (!canvas) {
    throw new Error('No canvas element.');
  }
  const context = await setupWebGpuContext(canvas);

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
  renderer = new props.rendererConstructor(context, {
    ...props.options,
    texture,
  });

  return { context, renderer };
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
  const scaledWidth = canvasEl.value?.clientWidth / (props.options?.scale || 1);
  const scaledHeight =
    canvasEl.value?.clientHeight / (props.options?.scale || 1);
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
    if (!context || !renderer) {
      const res = await setupContext();
      context = res.context;
      renderer = res.renderer;
    }

    const deltaTime = time - lastTime;
    lastTime = time;
    frameTime += deltaTime;

    if (!canvasEl.value) {
      return;
    }

    // TODO: Only re-create when needed.  This creates a new depth every frame.
    try {
      const target = new RenderTarget(context, true);

      renderer.update(frameTime, target);
      renderer.renderFrame(target);
    } catch (e) {
      console.log(
        `Error (${props.name}): Caught error trying to get rendertarget.`,
        e,
      );
      context = null;
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
  <div class="container">
    <div class="title">{{ name }}</div>
    <div class="canvas-container">
      <canvas ref="canvasEl" class="canvas" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin: 0.2em; */
  /* box-sizing: content-box; */
  margin-bottom: 0.1em;
  background-color: rgb(83, 83, 83);
  background-color: rgb(255, 255, 255);
  box-shadow: 3px 3px 6px 2px rgba(0, 0, 0, 0.4);
  font-size: 0.8em;
}

.title {
  color: rgb(30, 30, 30);
  padding: 0.2rem 0;
  text-align: center;
  width: 100%;
  text-wrap: wrap;
  background-color: rgba(250, 250, 250, 0.1);
  font-size: 1rem;
  font-weight: 100;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: 0.06rem;
  line-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-container {
  width: 100%;
  flex-grow: 1;
}
.canvas {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
}
</style>
