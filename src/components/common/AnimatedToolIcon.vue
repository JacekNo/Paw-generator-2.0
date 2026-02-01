<script setup lang="ts">
import { computed } from 'vue';
import { PenTool, QrCode, Library, Layers, Atom } from 'lucide-vue-next';

const props = defineProps<{
  type: 'generator' | 'qr' | 'resources' | 'brand' | 'default';
}>();

const iconComponent = computed(() => {
  switch (props.type) {
    case 'generator': return PenTool;
    case 'qr': return QrCode;
    case 'resources': return Library;
    case 'brand': return Atom;
    default: return Layers;
  }
});

const colorClass = computed(() => {
  switch (props.type) {
    case 'generator': return 'text-teb-blue bg-blue-50 border-blue-100';
    case 'qr': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    case 'resources': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    default: return 'text-slate-600 bg-slate-50 border-slate-100';
  }
});
</script>

<template>
  <div 
    class="relative w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm overflow-hidden group"
    :class="colorClass"
  >
    <div class="absolute inset-0 bg-white/40 blur-md scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full"></div>
    
    <component 
      :is="iconComponent" 
      :size="24" 
      class="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" 
      stroke-width="2.5"
    />
  </div>
</template>