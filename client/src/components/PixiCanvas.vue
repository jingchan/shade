<!-- <script setup lang="ts">
import {
  Application,
  Assets,
  ImageSource,
  Shader,
  Sprite,
  Texture,
} from 'pixi.js';
import { onMounted, ref } from 'vue';
import vertex from '../shaders/custom.vert';
import fragment from '../shaders/custom.frag';

const appEl = ref<HTMLElement>();
const app = new Application();

onMounted(async () => {
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    preference: 'webgl',
  });

  appEl.value?.appendChild(app.canvas);
  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
  // Create a new Sprite from an image path.
  const bunny = new Sprite(texture);

  // Add to stage.
  app.stage.addChild(bunny);

  // Center the sprite's anchor point.
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen.
  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;

  app.ticker.add((time) => {
    const dt = time.deltaTime;
    // Animation update
    bunny.rotation += 0.1 * dt;
  });

  const image = new Image();

  image.onload = function () {
    // create a texture source
    const imageSource = new ImageSource({
      resource: image,
    });

    // create a texture
    const texture = new Texture({
      source,
    });

    const shader = Shader.from({
      gl: { vertex, fragment },
      gpu: {
        vertex: {
          entryPoint: 'mainVert',
          source,
        },
        fragment: {
          entryPoint: 'mainFrag',
          source,
        },
      },
      resources: {
        uTexture: imageSource.source,
        uSampler: imageSource.sampler,
        uColor: [1, 0, 0, 1],
      },
    });
  };

  image.src = 'https://pixijs.com/assets/bunny.png';
});

// let elapsed = 0.0;
// // Tell our application's ticker to run a new callback every frame, passing
// // in the amount of time that has passed since the last tick
// app.ticker.add((ticker) => {
//   // Add the time to our total elapsed time
//   elapsed += ticker.deltaTime;
//   // Update the sprite's X position based on the cosine of our elapsed time.  We divide
//   // by 50 to slow the animation down a bit...
//   sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
// });
</script>

<template>
  <div ref="appEl" />
</template>

<style scoped>
/* div {
  background-color: #b983ee;
} */
</style> -->
