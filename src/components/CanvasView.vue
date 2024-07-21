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
  RendererContext,
  setupCanvasAndContext,
} from '../render/renderer';
import { TriangleRenderer } from '../render/triangle';
import { RenderTarget } from '../render/rendertarget';
import { Size } from '../types';
import { BaseRendererOptions } from '../render/base';

type RendererConstructor<T extends Renderer> = new (...args: any[]) => T;

interface Props {
  renderer: RendererConstructor<Renderer>;
  options?: BaseRendererOptions;
}

const props = withDefaults(defineProps<Props>(), {
  renderer: TriangleRenderer,
  options: undefined,
});

const canvasEl = ref<HTMLCanvasElement>();
let context: RendererContext | null = null;
let current_renderer: Renderer | null = null;
let frameHandle: number = 0;

async function setupContext() {
  const canvas = canvasEl.value!;
  if (!canvas) {
    throw new Error('No canvas element.');
  }
  const context = await setupCanvasAndContext(canvas);

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

  current_renderer = new props.renderer(context, {
    ...props.options,
    texture,
  });

  return { context, current_renderer };
}

async function startAnimationLoop() {
  async function frameLoop(time: DOMHighResTimeStamp) {
    if (context === null || current_renderer === null) {
      const res = await setupContext();
      context = res.context;
      current_renderer = res.current_renderer;
    }

    // Resize backing colorbuffer if canvas size changed.
    if (
      canvasEl.value &&
      (canvasEl.value?.width !== canvasEl.value?.clientWidth ||
        canvasEl.value?.height !== canvasEl.value?.clientHeight)
    ) {
      canvasEl.value.width = canvasEl.value.clientWidth;
      canvasEl.value.height = canvasEl.value.clientHeight;
    }

    // TODO: Only re-create when needed.  This creates a new depth every frame.
    try {
      const target = new RenderTarget(context, true);

      current_renderer.update(time, target);
      current_renderer.renderFrame(target);
    } catch (e) {
      console.log('Caught error trying to get rendertarget.', e);
    }
    frameHandle = requestAnimationFrame(frameLoop);
  }
  frameHandle = requestAnimationFrame(frameLoop);
}
onMounted(async () => {
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
  <canvas ref="canvasEl" />
</template>

<style scoped></style>
