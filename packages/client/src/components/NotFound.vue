<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <div class="main">
    <h1>404 - Not found</h1>
    <p>
      The requested URL {{ `(${route.query.r})` }} was not found on this server.
    </p>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* font-size: 3em; */
}
h1 {
  margin: 0;
  font-size: 3rem;
}
p {
  margin: 0;
  font-size: 2rem;
}
</style>
