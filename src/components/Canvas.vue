<script setup lang="ts">
import {
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  ref,
} from 'vue';
import { Renderer, setupCanvasAndContext } from '../render/renderer';
import { TriangleRenderer } from '../render/triangle';
import { RenderTarget } from '../render/rendertarget';
import { Size } from '../types';

type RendererConstructor<T extends Renderer> = new (...args: any[]) => T;

interface Props {
  renderer: RendererConstructor<Renderer>;
  image?: string;
}

const props = withDefaults(defineProps<Props>(), {
  renderer: TriangleRenderer,
  image: undefined,
});

const canvasEl = ref<HTMLCanvasElement>();

let frameHandle: number = 0;

async function startAnimationLoop() {
  const canvas = canvasEl.value;
  if (!canvas) {
    throw new Error('No canvas element.');
  }
  const context = await setupCanvasAndContext(canvas);
  // const renderSize = new Size(canvas.width, canvas.height);

  const texture = await (async () => {
    if (!props.image) {
      return;
    }
    const image = new Image();
    image.src = props.image;
    console.log(props.image);
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const bitmap = await createImageBitmap(image);
    const bitmapSize = new Size(bitmap.width, bitmap.height);
    const texture = context.device.createTexture({
      size: bitmapSize.as_array(true),
      format: 'rgba8unorm',
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

  const renderer = new props.renderer(context, texture);

  function frameLoop(time: DOMHighResTimeStamp) {
    const target = new RenderTarget(context, true);
    renderer.update(time);
    renderer.renderFrame(target);
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
