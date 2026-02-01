// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import GeneratorView from '../views/GeneratorView.vue';
import QrGeneratorView from '../views/QrGeneratorView.vue';
import ResourcesView from '../views/ResourcesView.vue'

// w tablicy routes:


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/generator',
      name: 'generator',
      component: GeneratorView
    },
    { 
      path: '/qr', 
      name: 'qr', 
      component: QrGeneratorView 
    },
    {
      path: '/resources',
      name: 'resources',
      component: ResourcesView
    }
  ]
});

export default router;