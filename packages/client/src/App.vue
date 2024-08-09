<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';

const links = [
  { name: 'Main', path: '/' },
  { name: 'Card', path: '/card' },
  { name: 'Demos', path: '/demos' },
  { name: 'Shader', path: '/shader' },
];

// Global handler for edited event.
// TODO: confirm navigation
function handleEdited() {
  console.log('global edited handler');
}
</script>

<template>
  <nav class="nav">
    <NavBar :links="links" />
  </nav>
  <main class="main">
    <RouterView @edited="handleEdited" />
  </main>
</template>

<style scoped>
.main {
  flex-grow: 1;
}
</style>
