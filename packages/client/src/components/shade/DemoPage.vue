<script setup lang="ts">
import { onMounted } from 'vue';

// import CanvasView from './CanvasView.vue';
import DemoView from './DemoView.vue';
import { useRouter } from 'vue-router';
import DEMOS from '../../render/demos.ts';

const router = useRouter();

onMounted(() => {});

function goToShader(id?: string | number) {
  if (typeof id === 'undefined') {
    return;
  }

  router.push(`/shader/${id}`);
}
</script>

<template>
  <div class="main">
    <div class="canvases">
      <DemoView
        v-for="demo in DEMOS"
        :key="demo.name"
        :name="demo.name"
        :rendererConstructor="demo.renderer"
        :options="demo.options"
        :class="demo.id ? 'clickable' : undefined"
        @click="goToShader(demo.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.canvases {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  padding-top: 6px;
}

@media (min-width: 800px) {
  .canvases {
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 20px;
    padding: 20px;
  }
}

@media (min-width: 1000px) {
  .canvases {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }
}

.clickable {
  background-color: rgb(198, 197, 255);
  cursor: pointer;
  animation: shadow-pulse 1s infinite ease-out;
}
/* .clickable:not(:hover) {
  animation: shadow-pulse 1s infinite ease-out;
} */
.clickable:hover {
  animation: blue-pulse 0.3s infinite alternate;
}
@keyframes shadow-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(7, 205, 223, 0.746);
  }
  100% {
    box-shadow: 0 0 2px 10px rgba(3, 174, 231, 0);
  }
}

@keyframes blue-pulse {
  0% {
    box-shadow: 0 0 2px 6px rgba(7, 106, 235, 0.587);
  }
  100% {
    box-shadow: 0 0 2px 6px rgba(8, 84, 236, 0.818);
  }
}
</style>
