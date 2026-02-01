<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { 
  LayoutDashboard, 
  PenTool, 
  QrCode, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Library,
  X 
} from 'lucide-vue-next';

// PROPS (Do obsługi Mobile)
defineProps<{
  isMobileOpen?: boolean
}>();

// EMITS
const emit = defineEmits(['closeMobile']);

// STAN ZWINIĘCIA (Tylko Desktop)
const isCollapsed = ref(false);
const route = useRoute();

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// MENU ITEMS - Nowa, czystsza struktura
const menuItems = [
  {
    category: 'Start',
    items: [
      { name: 'Pulpit', path: '/', icon: LayoutDashboard }
    ]
  },
  {
    category: 'Kreatory', // Zmieniono z "Narzędzia" na "Kreatory"
    items: [
      { name: 'Generator Grafik', path: '/generator', icon: PenTool },
      { name: 'Kody QR', path: '/qr', icon: QrCode }
    ]
  },
  {
    category: 'Zasoby', // Nowa sekcja
    items: [
      { name: 'Zasoby Marki', path: '/resources', icon: Library }
    ]
  }
];

const isActive = (path: string) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<template>
  <div>
    <div 
      v-if="isMobileOpen" 
      @click="emit('closeMobile')"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity animate-in fade-in"
    ></div>

    <aside 
      class="bg-white border-r border-slate-100 h-screen flex flex-col transition-all duration-300 ease-in-out shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]
             fixed top-0 left-0 z-50 md:relative"
      :class="[
        // Mobile classes
        isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0',
        // Desktop classes (Szerokość zależna od zwinięcia)
        isCollapsed ? 'md:w-20' : 'md:w-72'
      ]"
    >
      
      <button 
        @click="toggleSidebar"
        class="hidden md:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-teb-blue hover:border-teb-blue transition-all shadow-md z-50 cursor-pointer hover:scale-110"
        :title="isCollapsed ? 'Rozwiń' : 'Zwiń'"
      >
        <ChevronRight v-if="isCollapsed" :size="14" />
        <ChevronLeft v-else :size="14" />
      </button>

      <button 
        @click="emit('closeMobile')"
        class="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
      >
        <X :size="24" />
      </button>


      <div class="h-24 flex items-center relative shrink-0 transition-all duration-300"
           :class="isCollapsed ? 'md:justify-center px-0' : 'justify-start px-6'">
        
          <img 
              v-if="!isCollapsed"
              src="/assets/logo_full.png" 
              alt="PAW 2.0" 
              class="h-10 object-contain transition-all animate-in fade-in duration-300" 
          />
          
          <img 
              v-else
              src="/assets/sygnet_paw.svg" 
              alt="P" 
              class="hidden md:block h-8 w-8 object-contain transition-all animate-in zoom-in duration-300" 
          />
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-8 overflow-x-hidden scrollbar-hide">
        <div v-for="(group, index) in menuItems" :key="index">
          
          <div 
             class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-3 transition-all duration-300 h-4 whitespace-nowrap overflow-hidden"
             :class="isCollapsed ? 'md:opacity-0 md:w-0' : 'opacity-100 w-full'"
          >
            {{ group.category }}
          </div>

          <ul class="space-y-1">
            <li v-for="item in group.items" :key="item.path">
              <RouterLink 
                :to="item.path" 
                @click="emit('closeMobile')"
                class="relative flex items-center px-3 py-3 rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap"
                :class="[
                  isActive(item.path) 
                    ? 'bg-blue-50/80 text-teb-blue font-semibold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium',
                  isCollapsed ? 'md:justify-center' : 'gap-3'
                ]"
              >
                <div v-if="isActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teb-blue rounded-r-full transition-all"></div>
                
                <component :is="item.icon" :size="22" class="shrink-0 transition-colors duration-200 relative z-10" :class="isActive(item.path) ? 'text-teb-blue' : 'text-slate-400 group-hover:text-slate-600'" />

                <span class="transition-all duration-300 relative z-10" :class="isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100 w-auto'">
                  {{ item.name }}
                </span>

                <div v-if="isCollapsed" class="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl border border-slate-700">
                  {{ item.name }}
                  <div class="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                </div>
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50" v-if="!isCollapsed">
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Powered by</p>
          <div class="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <div class="font-bold text-slate-700 text-sm leading-tight">
                  TEB <span class="text-teb-blue">Edukacja</span>
              </div>
          </div>
      </div>

      <div class="p-3 bg-white shrink-0" :class="isCollapsed ? 'border-t border-slate-100' : ''">
          <div class="flex items-center gap-3 p-2 rounded-xl transition-all overflow-hidden cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-100 group">
              <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 font-bold text-xs">JS</div>
              
              <div class="flex-1 overflow-hidden transition-all duration-300" 
                   :class="isCollapsed ? 'md:w-0 md:opacity-0 md:hidden' : 'w-auto opacity-100'">
                  <div class="text-xs font-bold text-slate-700 truncate">Jan Sztudent</div>
                  <div class="text-[10px] text-slate-400 truncate">Administrator</div>
              </div>
              
              <button v-if="!isCollapsed" class="text-slate-300 hover:text-red-500 transition-colors">
                  <LogOut :size="18" />
              </button>
          </div>
      </div>
    </aside>
  </div>
</template>