<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Sidebar from './components/layout/Sidebar.vue';
import { Menu } from 'lucide-vue-next'; // Ikona hamburgera

// Stan menu mobilnego
const isMobileMenuOpen = ref(false);
const route = useRoute();
</script>

<template>
  <div class="flex h-screen w-full bg-slate-50 text-slate-600 font-sans overflow-hidden">
    
    <Sidebar 
      :is-mobile-open="isMobileMenuOpen" 
      @close-mobile="isMobileMenuOpen = false" 
    />

    <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
      
      <header class="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 z-30 shadow-sm">
         <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-linear-to-br from-teb-blue to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">P</div>
            <span class="font-bold text-slate-800">PAW 2.0</span>
         </div>

         <button 
           @click="isMobileMenuOpen = true"
           class="p-2 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 active:scale-95 transition"
         >
           <Menu :size="24" />
         </button>
      </header>

      <div class="flex-1 overflow-hidden relative">
        <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component 
            :is="Component" 
            :key="route.fullPath" 
            class="h-full w-full" 
          />
        </Transition>
      </RouterView>

    </div>
  </div>
  </div>
</template>

<style>
/* ANIMACJE PRZEJŚĆ (PAGE TRANSITIONS) 
  Subtelny efekt Fade + lekkie przesunięcie w pionie
*/

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px); /* Nowa strona wchodzi od dołu */
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* Stara strona ucieka do góry */
}
</style>