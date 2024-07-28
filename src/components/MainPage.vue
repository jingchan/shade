<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { CardStack } from '../cardStack.ts';
import { Card } from '../card.ts';
import CardStackView from './CardStackView.vue';
import CanvasView, { CanvasViewOptions } from './CanvasView.vue';
import { TriangleRenderer } from '../render/triangle.ts';
import { CubeRenderer } from '../render/cube.ts';
import { ScreenRenderer } from '../render/screen.ts';
import { TextureRenderer } from '../render/texture.ts';
import { BaseRenderer } from '../render/base';
import checkerShader from '../shaders/checker.wgsl';
import baseShader from '../shaders/base.wgsl';
import perlinShader from '../shaders/perlin.wgsl';
import noiseShader from '../shaders/noise.wgsl';
import circleShader from '../shaders/circle.wgsl';
import ellipseShader from '../shaders/ellipse.wgsl';
import marchShader from '../shaders/march.wgsl';
import triShader from '../shaders/tri.wgsl';
import roundedTriShader from '../shaders/roundedTri.wgsl';
import lineShader from '../shaders/line.wgsl';
import boxShader from '../shaders/box.wgsl';
import roundedBoxShader from '../shaders/roundedBox.wgsl';
import { Shader } from '../shader.ts';

const DEMOS: {
  name: string;
  renderer: RendererType;
  options?: CanvasViewOptions;
} = [
  { name: 'screen', renderer: ScreenRenderer },
  { name: 'tri', renderer: TriangleRenderer },
  { name: 'cube', renderer: CubeRenderer },
  {
    name: 'texture',
    renderer: TextureRenderer,
    options: {
      image: new URL('../assets/Placeholder.png', import.meta.url).href,
    },
  },
  {
    name: 'options (base)',
    renderer: BaseRenderer,
    options: {
      // color: [1.0, 0.0, 1.0, 0.5],
    },
  },
  {
    name: 'checker (base)',
    renderer: BaseRenderer,
    options: { vertexShader: checkerShader, fragmentShader: checkerShader },
  },
  {
    name: 'custom shader (base)',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(baseShader),
      fragmentShader: new Shader(baseShader),
      color: [1.0, 0.0, 1.0, 0.5],
    },
  },
  {
    name: 'perlin noise (base)',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(perlinShader),
      fragmentShader: new Shader(perlinShader),
      // color: [1.0, 0.0, 1.0, 0.5],
      scale: 2,
    },
  },
  {
    name: 'noise (base)',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(noiseShader),
      fragmentShader: new Shader(noiseShader),
      // color: [1.0, 0.0, 1.0, 0.5],
      scale: 2,
    },
  },
  {
    name: 'SDF: circle',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(circleShader),
      fragmentShader: new Shader(circleShader),
      // color: [1.0, 0.0, 1.0, 0.5],
    },
  },
  {
    name: 'SDF: box',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(boxShader),
      fragmentShader: new Shader(boxShader),
      // color: [1.0, 0.0, 1.0, 0.5],
    },
  },
  {
    name: 'SDF: roundedBox',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(roundedBoxShader),
      fragmentShader: new Shader(roundedBoxShader),
      // color: [1.0, 0.0, 1.0, 0.5],
    },
  },
  {
    name: 'SDF: triangle',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(triShader),
      fragmentShader: new Shader(triShader),
      // color: [1.0, 0.0, 1.0, 0.5],
    },
  },
  {
    name: 'SDF: round triangle',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(roundedTriShader),
      fragmentShader: new Shader(roundedTriShader),
      // color: [1.0, 0.0, 1.0, 0.5],
    },
  },
  {
    name: 'SDF: line',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(lineShader),
      fragmentShader: new Shader(lineShader),
      // color: [1.0, 0.0, 1.0, 0.5],
    },
  },
  {
    name: 'Ray Marching',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(marchShader),
      fragmentShader: new Shader(marchShader),
      // color: [1.0, 0.0, 1.0, 0.5],
    },
  },
  {
    name: 'SDF: ellipse',
    renderer: BaseRenderer,
    options: {
      vertexShader: new Shader(ellipseShader),
      fragmentShader: new Shader(ellipseShader),
      // color: [1.0, 0.0, 1.0, 0.5],
    },
  },
];

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

const demoWidth = ref(200);
const demoCols = ref(4);
</script>

<template>
  <div class="main">
    Hello
    <div class="canvases">
      <CanvasView
        v-for="demo in DEMOS"
        :key="demo.name"
        :name="demo.name"
        :renderer="demo.renderer"
        :options="demo.options"
      />
    </div>
    <!-- <input v-model="demoWidth" type="range" min="100" max="1000" step="0.01" />
    <label for="demoCols"># Columns</label> -->
    <input
      v-model="demoCols"
      id="demoCols"
      type="range"
      min="1"
      max="8"
      step="1"
    />
    <label for="demoCols"># Columns</label>
    <!-- <form>
      <input v-model="demoCols" id="asdf" type="checkbox" />
      <label for="asdf">awef</label>
    </form> -->
    <div>{{ demoWidth }}</div>
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
  display: grid;
  grid-template-columns: v-bind('`repeat(${demoCols}, minmax(200px, 1fr))`');
  justify-content: start;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

.canvases-flex {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
