<script setup lang="ts">
import { onMounted } from 'vue';

// const route = useRoute();
// const router = useRouter();

onMounted(() => {});

// function goToShader(name: string) {
//   console.log('goToShader', name);
//   // this.$router.push({ name: 'ShaderPage', params: { name } });
//   router.push('/shader');
//   // router.addRoute('/shader', route);
//   // router.push({ name: '/shader', params: { name } });
// }
</script>

<template>
  <div class="main">
    Hello From Main Page
    <!-- <input v-model="demoWidth" type="range" min="100" max="1000" step="0.01" />
    <label for="demoCols"># Columns</label> -->
  </div>
</template>

<style scoped>
.main {
  height: 100%;
}
</style>
