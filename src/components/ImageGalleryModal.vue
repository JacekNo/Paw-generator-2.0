<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useGalleryStore } from '@/stores/galleryStore';
import { Search, X, Image as ImageIcon, LayoutGrid, FolderOpen } from 'lucide-vue-next';

const emit = defineEmits(['close', 'select']);
const store = useGalleryStore();

// Reset stanu przy otwarciu
store.searchQuery = '';

// Zamykanie na ESC
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));

const selectImage = (filename: string) => {
  // Emitujemy pełną ścieżkę do pliku
  emit('select', store.getImageUrl(filename));
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="relative w-full max-w-6xl h-[85vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
      
      <div class="w-64 bg-slate-50 border-r border-slate-200 flex-col shrink-0 hidden md:flex">
        <div class="p-5 border-b border-slate-100">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen class="text-teb-blue" :size="20"/>
            Kategorie
          </h3>
        </div>
        
        <div class="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
          
          <button 
            @click="store.setCategory('all')"
            class="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
            :class="store.selectedCategoryId === 'all' 
              ? 'bg-white text-teb-blue shadow-sm ring-1 ring-slate-100' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'"
          >
            <LayoutGrid :size="16" />
            Wszystkie zdjęcia
            <span class="ml-auto bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded text-[10px] tabular-nums">
              {{ store.allImages.length }}
            </span>
          </button>

          <div class="h-px bg-slate-200 my-2 mx-1"></div>

          <button 
            v-for="cat in store.categories" 
            :key="cat.id"
            @click="store.setCategory(cat.id)"
            class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
            :class="store.selectedCategoryId === cat.id 
              ? 'bg-blue-50 text-teb-blue' 
              : 'text-slate-600 hover:bg-slate-100'"
          >
            <span class="truncate">{{ cat.name }}</span>
            <span class="ml-auto text-[10px] opacity-50">{{ cat.images.length }}</span>
          </button>
        </div>
      </div>

      <div class="flex-1 flex flex-col min-w-0 bg-white">
        
        <div class="p-4 border-b border-slate-100 flex items-center gap-4 shrink-0">
          
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input 
              v-model="store.searchQuery"
              type="text" 
              placeholder="Szukaj zdjęcia (np. masaż, szkoła)..." 
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teb-blue/20 focus:border-teb-blue transition"
              autofocus
            />
          </div>

          <button 
            @click="$emit('close')"
            class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X :size="24" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/30">
          
          <div class="mb-4 flex items-center justify-between">
             <h2 class="text-lg font-bold text-slate-800">
               {{ store.activeCategoryName }}
               <span v-if="store.searchQuery" class="text-slate-400 font-normal text-sm">
                 — wyniki dla "{{ store.searchQuery }}"
               </span>
             </h2>
             <span class="text-xs text-slate-400 font-medium">Znaleziono: {{ store.filteredImages.length }}</span>
          </div>

          <div v-if="store.filteredImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <button 
              v-for="img in store.filteredImages" 
              :key="img.id"
              @click="selectImage(img.filename)"
              class="group relative aspect-4/3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teb-blue transition-all overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-teb-blue"
            >
              <img 
                :src="store.getImageUrl(img.filename)" 
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end">
                <span class="text-white text-[11px] font-bold leading-tight line-clamp-2">{{ img.title }}</span>
              </div>

              <div v-if="img.isNew" class="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                NOWOŚĆ
              </div>

              <div class="absolute inset-0 bg-teb-blue/10 opacity-0 group-active:opacity-100 transition-opacity pointer-events-none"></div>
            </button>
          </div>

          <div v-else class="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
               <ImageIcon :size="32" class="opacity-50" />
            </div>
            <p class="text-sm font-medium">Nie znaleziono zdjęć dla tych kryteriów.</p>
            <button @click="store.setCategory('all'); store.searchQuery = ''" class="text-teb-blue text-xs font-bold hover:underline">Wyczyść filtry</button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>