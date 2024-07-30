import { createRouter, createWebHistory } from 'vue-router';

// import MainPage from './components/MainPage.vue';
import ShaderPage from './components/shade/ShaderPage.vue';
import CardPage from './components/card/CardPage.vue';
import DemoPage from './components/shade/DemoPage.vue';

const routes = [
  { path: '/', component: DemoPage },
  { path: '/card', component: CardPage },
  { path: '/demos', component: DemoPage },
  { path: '/shader/:id?', component: ShaderPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
