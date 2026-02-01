<script setup lang="ts">
import { ref } from 'vue';
import { 
  PenTool, QrCode, ArrowRight, Library, HelpCircle, MessageCircle 
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import AnimatedToolIcon from '@/components/common/AnimatedToolIcon.vue'; // Import animacji

// Logika powitania
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Dzień dobry';
  if (hour < 18) return 'Cześć';
  return 'Dobry wieczór';
};
const greeting = ref(getGreeting());
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-slate-50 w-full h-full relative">
    
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-0 right-0 w-150 h-150 bg-blue-50/80 rounded-full blur-3xl mix-blend-multiply"></div>
        <div class="absolute bottom-0 left-0 w-125 h-125 bg-indigo-50/80 rounded-full blur-3xl mix-blend-multiply"></div>
    </div>

    <div class="max-w-7xl mx-auto w-full p-6 md:p-10 lg:p-12 space-y-12 relative z-10">
      
      <header class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div class="flex items-center gap-5">
            <AnimatedToolIcon type="default" />
            
            <div class="space-y-1">
                <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {{ greeting }}!
                </h1>
                <p class="text-slate-500 text-lg">
                    Co chcesz dzisiaj przygotować?
                </p>
            </div>
        </div>
        
        <div class="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm text-slate-500">
            <HelpCircle :size="16" class="text-teb-blue" />
            <span>Potrzebujesz pomocy? <a href="#" class="text-teb-blue font-bold hover:underline">Napisz do wsparcia</a></span>
        </div>
      </header>

      <div class="space-y-4">
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Dostępne narzędzia</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           <RouterLink to="/generator" class="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:border-teb-blue/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
              <div class="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <PenTool :size="140" />
              </div>
              
              <div class="w-14 h-14 bg-blue-50 text-teb-blue rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teb-blue group-hover:text-white transition-colors duration-300 shadow-sm">
                  <PenTool :size="28" />
              </div>
              
              <h3 class="text-2xl font-bold text-slate-900 mb-2">Grafiki Social Media</h3>
              <p class="text-slate-500 mb-8 leading-relaxed text-sm">
                  Wybierz to, jeśli potrzebujesz posta na <strong>Facebooka</strong>, <strong>Instagram</strong> lub <strong>LinkedIn</strong>. System sam zadba o logo i kolory.
              </p>
              
              <div class="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-teb-blue transition-colors">Rozpocznij</span>
                  <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teb-blue group-hover:text-white transition-all">
                      <ArrowRight :size="16" />
                  </div>
              </div>
           </RouterLink>
  
           <RouterLink to="/qr" class="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:border-teb-blue/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
              <div class="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <QrCode :size="140" />
              </div>
  
              <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <QrCode :size="28" />
              </div>
              
              <h3 class="text-2xl font-bold text-slate-900 mb-2">Kody QR</h3>
              <p class="text-slate-500 mb-8 leading-relaxed text-sm">
                  Wybierz to, jeśli chcesz stworzyć kod kierujący do strony www. Idealne na <strong>ulotki</strong>, <strong>plakaty</strong> lub do prezentacji.
              </p>
              
              <div class="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Utwórz kod</span>
                  <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <ArrowRight :size="16" />
                  </div>
              </div>
           </RouterLink>
  
           <RouterLink to="/resources" class="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:border-indigo-500/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
              
              <div class="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Library :size="140" />
              </div>

              <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Library :size="28" />
              </div>
              
              <h3 class="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">Zasoby Marki</h3>
              <p class="text-slate-500 mb-8 leading-relaxed text-sm">
                  Tu znajdziesz gotowe logotypy do pobrania, kolory firmowe oraz architekturę marki.
              </p>
              
              <div class="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Przeglądaj</span>
                  <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight :size="16" />
                  </div>
              </div>
           </RouterLink>
  
        </div>
      </div>

      <div class="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
         <div class="flex items-center gap-4">
             <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teb-blue shadow-sm border border-blue-100">
                 <MessageCircle :size="20" />
             </div>
             <div>
                 <h4 class="font-bold text-slate-800 text-sm">Masz pomysł na usprawnienie?</h4>
                 <p class="text-xs text-slate-500">To narzędzie jest dla Ciebie. Daj znać, czego Ci brakuje.</p>
             </div>
         </div>
         <button class="px-4 py-2 bg-white border border-blue-200 text-teb-blue text-xs font-bold rounded-lg hover:bg-blue-50 transition shadow-sm cursor-pointer">
             Wyślij sugestię
         </button>
      </div>

    </div>
  </div>
</template>