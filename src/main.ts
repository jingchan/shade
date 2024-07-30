import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import * as monaco from 'monaco-editor';
import disableKeyShortcuts from './disableKeys';

monaco;

disableKeyShortcuts(self);

createApp(App).use(router).mount('#app');
