<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { CardStack } from '../cardStack.ts';
import { Card } from '../card.ts';
import CardStackView from './CardStackView.vue';
import Canvas from './Canvas.vue';
import { TriangleRenderer } from '../render/triangle.ts';
import { CubeRenderer } from '../render/cube.ts';
import { ScreenRenderer } from '../render/screen.ts';
import { TextureRenderer } from '../render/texture.ts';

// const cards = ref(CardStack.example());
const cards = ref(new CardStack([]));

function addRandomCard() {
  cards.value.addCard(Card.random());
}
function removeCard() {
  const randomIndex = Math.floor(Math.random() * cards.value.length);
  cards.value.removeCard(randomIndex);
}

onMounted(() => {
  cards.value = new CardStack([Card.random(), Card.random()]);
});
const textureImage = new URL('../assets/Placeholder.png', import.meta.url).href;
</script>

<template>
  <div class="main">
    Hello
    <div class="canvases">
      <Canvas :renderer="ScreenRenderer" class="demo-canvas" />
      <Canvas :renderer="TriangleRenderer" class="demo-canvas" />
      <Canvas :renderer="CubeRenderer" class="demo-canvas" />
      <Canvas
        :renderer="TextureRenderer"
        :image="textureImage"
        class="demo-canvas"
      />
      <!-- <Canvas
        :renderer="AreaRenderer"
        :image="textureImage"
        class="demo-canvas"
      /> -->
    </div>
    <button class="button" type="button" @click="addRandomCard">
      Add Card
    </button>
    <button class="button" type="button" @click="removeCard">
      Remove Card
    </button>
    <div class="tableau">
      <CardStackView :cards="cards" />
    </div>
  </div>
</template>

<style scoped>
.main {
  height: 100%;
}

.button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 8px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.demo-canvas {
  width: 400px;
  height: 300px;
  background-color: #ddd;
}

/* .card {
  background-color: rgba(130, 200, 180, 0.8);
  @apply no-selection;
} */
/* .card:hover {
  background-color: rgba(30, 200, 80, 0.8);
}
.card:active {
  background-color: rgba(30, 100, 180, 0.8);
} */

.no-selection {
  user-select: none;
}

.tableau {
  height: 30%;
  background-color: #cce;
  position: relative;
  padding: 20px;
  /* perspective: 30em */
}

.canvases {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
