<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

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
    <RouterLink
      v-for="link in links"
      :key="link.name"
      class="nav-link"
      activeClass="active"
      :to="link.path"
      @dragstart.prevent
    >
      {{ link.name }}
    </RouterLink>
  </nav>
  <main class="main">
    <RouterView @edited="handleEdited" />
  </main>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  /* padding: 1em; */
  background-color: #f0f0f0;
  user-select: none;
}

.nav-link {
  min-width: 3rem;
  text-align: center;
  height: 100%;
  padding: 1rem;
}

@media (min-width: 800px) {
  .nav-link {
    min-width: 10rem;
  }
}

.nav-link:hover {
  background-color: #d0d0d0;
}
.nav-link + .active {
  background-color: #e0e0e0;
  font-weight: 600;
  box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.6);
}
.main {
  flex-grow: 1;
}
</style>
