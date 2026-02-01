<script setup lang="ts">
import { ref } from 'vue';
import AnimatedToolIcon from '@/components/common/AnimatedToolIcon.vue';
import { 
  Download, Copy, Check, Palette, Layers, 
  X, Grid, Maximize, GraduationCap, Briefcase 
} from 'lucide-vue-next';

// --- STANY ---
const activeTab = ref('logos');
const copiedHex = ref<string | null>(null);
const selectedBrand = ref<BrandColor | null>(null); 

// --- DANE MAREK ---
interface BrandColor {
  name: string;
  slug: string;
  col1: string; // Primary
  col2: string; // Secondary
}

// 1. Marka Główna
const MASTER_BRAND: BrandColor = { 
  name: 'TEB Edukacja', slug: 'teb-edukacja', col1: '#102D69', col2: '#0F4496' 
};

// 2. Szkoły Średnie (Młodzież)
const YOUTH_BRANDS: BrandColor[] = [
  { name: 'Technikum', slug: 'teb-technikum', col1: '#C51523', col2: '#FF545E' },
  { name: 'Liceum', slug: 'teb-liceum', col1: '#0085B7', col2: '#40B6FF' },
  { name: 'Liceum Plastyczne', slug: 'teb-plastyczne', col1: '#A43282', col2: '#DD48B1' },
  { name: 'Edukacja Domowa', slug: 'teb-domowa', col1: '#0941A1', col2: '#1E53E5' },
];

// 3. Szkoły Policealne i Dorośli
const ADULT_BRANDS: BrandColor[] = [
  { name: 'Szkoły Policealne', slug: 'teb-policealne', col1: '#E27D00', col2: '#F5B062' },
  { name: 'Szkoły Medyczne', slug: 'teb-medyczne', col1: '#009489', col2: '#B8DDD5' },
  { name: 'Liceum dla Dorosłych', slug: 'teb-dorosli', col1: '#52AE32', col2: '#A8CF88' },
  { name: 'Akademia III Wieku', slug: 'teb-akademia', col1: '#702283', col2: '#CBAFD1' },
  { name: 'Kursy', slug: 'teb-kursy', col1: '#994365', col2: '#C7839F' },
  { name: 'Szkolenia', slug: 'teb-szkolenia', col1: '#5D686E', col2: '#CED1D2' },
];

// --- HELPERY ---
const copyToClipboard = (hex: string) => {
  navigator.clipboard.writeText(hex);
  copiedHex.value = hex;
  setTimeout(() => copiedHex.value = null, 2000);
};

// Generowanie ścieżek do plików SVG (z podkreślnikami)
const getLogoPath = (slug: string, type: 'poziom' | 'pion', variant: 'kolor' | 'bialy') => {
    return `/assets/brands/${slug}_${type}_${variant}.svg`;
};

const openBrandModal = (brand: BrandColor) => {
    selectedBrand.value = brand;
};
</script>

<template>
  <div class="flex flex-col lg:flex-row h-full w-full overflow-hidden relative bg-slate-50">
    
    <aside class="w-full lg:w-[320px] bg-white border-r border-slate-200 flex flex-col h-full z-20 shrink-0">
      <div class="p-6 pb-8 shrink-0 border-b border-slate-100 flex items-center gap-4">
        <div class="transform scale-75 origin-left shrink-0"><AnimatedToolIcon type="resources" /></div>
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Zasoby Marki</h2>
          <p class="text-xs text-slate-500 mt-1">Architektura i Brandbook</p>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <button @click="activeTab = 'logos'" :class="activeTab === 'logos' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm">
            <Layers :size="18" /> Architektura Logo
        </button>
        <button @click="activeTab = 'colors'" :class="activeTab === 'colors' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm">
            <Palette :size="18" /> Kolorystyka Marek
        </button>
      </nav>

      <div class="p-6 border-t border-slate-100 mt-auto">
          <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
              <span class="font-bold mb-1 flex items-center gap-1"><Check :size="12"/> Wskazówka:</span>
              Każda placówka ma swój przypisany kolor. Nie mieszaj ich w komunikacji oficjalnej.
          </div>
      </div>
    </aside>

    <main class="flex-1 bg-slate-50/50 p-6 md:p-10 overflow-y-auto h-full w-full relative scrollbar-thin scrollbar-thumb-slate-200">
       <div class="max-w-7xl mx-auto space-y-12 relative z-10 pb-20">
           
           <section v-if="activeTab === 'logos'" class="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
               <div>
                   <h3 class="text-2xl font-bold text-slate-800 flex items-center gap-2"><Layers class="text-indigo-600"/> Architektura Marki</h3>
                   <p class="text-slate-500 text-sm mt-1">Podział na markę główną oraz linie edukacyjne.</p>
               </div>
               
               <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                   <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 block">Marka Parasolowa (Master)</span>
                   <div class="h-24 flex items-center justify-center mb-6">
                       <img :src="getLogoPath(MASTER_BRAND.slug, 'poziom', 'kolor')" class="h-full object-contain" :alt="MASTER_BRAND.name" />
                   </div>
                   <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">Używana we wspólnych materiałach wizerunkowych, gdzie nie występuje podział na konkretne typy szkół.</p>
                   <button @click="openBrandModal(MASTER_BRAND)" class="inline-flex items-center gap-2 px-6 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-full text-sm font-bold transition-colors">
                       <Maximize :size="16"/> Zobacz warianty
                   </button>
               </div>

               <div>
                   <div class="flex items-center gap-2 mb-6">
                       <GraduationCap class="text-slate-400" :size="20"/>
                       <h4 class="text-sm font-bold text-slate-500 uppercase tracking-widest">Szkoły Średnie (Młodzież)</h4>
                   </div>
                   <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                       <button v-for="brand in YOUTH_BRANDS" :key="brand.name" @click="openBrandModal(brand)" class="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all group text-center flex flex-col items-center h-48 justify-between relative overflow-hidden">
                           <div class="absolute top-0 left-0 right-0 h-1" :style="{ backgroundColor: brand.col1 }"></div>
                           <div class="flex-1 w-full flex items-center justify-center p-2">
                                <img :src="getLogoPath(brand.slug, 'poziom', 'kolor')" class="max-h-16 max-w-full object-contain" :alt="brand.name" />
                           </div>
                           <div class="w-full border-t border-slate-50 pt-3 mt-2">
                               <div class="text-xs font-bold text-slate-700">{{ brand.name }}</div>
                           </div>
                       </button>
                   </div>
               </div>

               <div>
                    <div class="flex items-center gap-2 mb-6">
                       <Briefcase class="text-slate-400" :size="20"/>
                       <h4 class="text-sm font-bold text-slate-500 uppercase tracking-widest">Szkoły Policealne i Dorośli</h4>
                   </div>
                   <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                       <button v-for="brand in ADULT_BRANDS" :key="brand.name" @click="openBrandModal(brand)" class="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all group text-center flex flex-col items-center h-48 justify-between relative overflow-hidden">
                           <div class="absolute top-0 left-0 right-0 h-1" :style="{ backgroundColor: brand.col1 }"></div>
                           <div class="flex-1 w-full flex items-center justify-center p-2">
                                <img :src="getLogoPath(brand.slug, 'poziom', 'kolor')" class="max-h-16 max-w-full object-contain" :alt="brand.name" />
                           </div>
                           <div class="w-full border-t border-slate-50 pt-3 mt-2">
                               <div class="text-xs font-bold text-slate-700">{{ brand.name }}</div>
                           </div>
                       </button>
                   </div>
               </div>
           </section>

           <section v-if="activeTab === 'colors'" class="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                <div class="mb-8">
                    <h3 class="text-2xl font-bold text-slate-800 flex items-center gap-2"><Palette class="text-indigo-600"/> Paleta Marek TEB</h3>
                </div>
                
                <div>
                     <h4 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Szkoły Średnie (Młodzież)</h4>
                     <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div v-for="brand in YOUTH_BRANDS" :key="brand.name" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            <div class="p-4 border-b border-slate-100 flex items-center gap-3">
                                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: brand.col1 }"></div>
                                <span class="font-bold text-slate-700 text-sm">{{ brand.name }}</span>
                            </div>
                            <div class="flex-1 flex flex-col">
                                <button @click="copyToClipboard(brand.col1)" class="flex-1 p-4 flex items-center justify-between group transition-colors hover:bg-slate-50 relative">
                                    <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg shadow-sm border border-black/5" :style="{ backgroundColor: brand.col1 }"></div><div class="text-left"><div class="text-[10px] font-bold text-slate-400 uppercase">Primary</div><div class="font-mono text-sm font-bold text-slate-700">{{ brand.col1 }}</div></div></div>
                                    <Copy :size="16" class="text-slate-300 group-hover:text-indigo-600"/>
                                    <div v-if="copiedHex === brand.col1" class="absolute inset-0 bg-white/90 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in"><Check :size="16"/> Skopiowano!</div>
                                </button>
                                <button @click="copyToClipboard(brand.col2)" class="flex-1 p-4 flex items-center justify-between group transition-colors hover:bg-slate-50 border-t border-slate-50 relative">
                                    <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg shadow-sm border border-black/5" :style="{ backgroundColor: brand.col2 }"></div><div class="text-left"><div class="text-[10px] font-bold text-slate-400 uppercase">Secondary</div><div class="font-mono text-sm font-bold text-slate-700">{{ brand.col2 }}</div></div></div>
                                    <Copy :size="16" class="text-slate-300 group-hover:text-indigo-600"/>
                                    <div v-if="copiedHex === brand.col2" class="absolute inset-0 bg-white/90 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in"><Check :size="16"/> Skopiowano!</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                     <h4 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Szkoły Policealne i Dorośli</h4>
                     <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div v-for="brand in ADULT_BRANDS" :key="brand.name" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            <div class="p-4 border-b border-slate-100 flex items-center gap-3">
                                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: brand.col1 }"></div>
                                <span class="font-bold text-slate-700 text-sm">{{ brand.name }}</span>
                            </div>
                            <div class="flex-1 flex flex-col">
                                <button @click="copyToClipboard(brand.col1)" class="flex-1 p-4 flex items-center justify-between group transition-colors hover:bg-slate-50 relative">
                                    <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg shadow-sm border border-black/5" :style="{ backgroundColor: brand.col1 }"></div><div class="text-left"><div class="text-[10px] font-bold text-slate-400 uppercase">Primary</div><div class="font-mono text-sm font-bold text-slate-700">{{ brand.col1 }}</div></div></div>
                                    <Copy :size="16" class="text-slate-300 group-hover:text-indigo-600"/>
                                    <div v-if="copiedHex === brand.col1" class="absolute inset-0 bg-white/90 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in"><Check :size="16"/> Skopiowano!</div>
                                </button>
                                <button @click="copyToClipboard(brand.col2)" class="flex-1 p-4 flex items-center justify-between group transition-colors hover:bg-slate-50 border-t border-slate-50 relative">
                                    <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg shadow-sm border border-black/5" :style="{ backgroundColor: brand.col2 }"></div><div class="text-left"><div class="text-[10px] font-bold text-slate-400 uppercase">Secondary</div><div class="font-mono text-sm font-bold text-slate-700">{{ brand.col2 }}</div></div></div>
                                    <Copy :size="16" class="text-slate-300 group-hover:text-indigo-600"/>
                                    <div v-if="copiedHex === brand.col2" class="absolute inset-0 bg-white/90 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in"><Check :size="16"/> Skopiowano!</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
           </section>
       </div>
    </main>

    <div v-if="selectedBrand" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="selectedBrand = null"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div class="flex items-center gap-3"><div class="w-4 h-4 rounded-full" :style="{ backgroundColor: selectedBrand.col1 }"></div><div><h3 class="text-xl font-bold text-slate-900">{{ selectedBrand.name }}</h3><p class="text-xs text-slate-500">Wybierz wariant do pobrania (SVG)</p></div></div>
                <button @click="selectedBrand = null" class="p-2 hover:bg-slate-200 rounded-full transition"><X :size="24" class="text-slate-500"/></button>
            </div>
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Grid :size="16"/> Układ Poziomy</h4>
                    <div class="p-6 rounded-xl border border-slate-200 bg-white flex flex-col items-center gap-4 hover:border-indigo-300 transition-colors">
                        <img :src="getLogoPath(selectedBrand.slug, 'poziom', 'kolor')" class="h-12 object-contain" />
                        <a :href="getLogoPath(selectedBrand.slug, 'poziom', 'kolor')" download class="w-full py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"><Download :size="14"/> Pobierz Kolor</a>
                    </div>
                    <div class="p-6 rounded-xl border border-slate-200 bg-slate-900 flex flex-col items-center gap-4 relative overflow-hidden group">
                        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 10px 10px;"></div>
                        <img :src="getLogoPath(selectedBrand.slug, 'poziom', 'bialy')" class="h-12 object-contain relative z-10" />
                        <a :href="getLogoPath(selectedBrand.slug, 'poziom', 'bialy')" download class="w-full py-2 bg-white/10 hover:bg-white hover:text-slate-900 text-white rounded-lg text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 relative z-10"><Download :size="14"/> Pobierz Białe</a>
                    </div>
                </div>
                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Grid :size="16" class="rotate-90"/> Układ Pionowy</h4>
                    <div class="p-6 rounded-xl border border-slate-200 bg-white flex flex-col items-center gap-4 hover:border-indigo-300 transition-colors">
                        <img :src="getLogoPath(selectedBrand.slug, 'pion', 'kolor')" class="h-24 object-contain" />
                        <a :href="getLogoPath(selectedBrand.slug, 'pion', 'kolor')" download class="w-full py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"><Download :size="14"/> Pobierz Kolor</a>
                    </div>
                    <div class="p-6 rounded-xl border border-slate-200 bg-slate-900 flex flex-col items-center gap-4 relative overflow-hidden">
                         <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 10px 10px;"></div>
                        <img :src="getLogoPath(selectedBrand.slug, 'pion', 'bialy')" class="h-24 object-contain relative z-10" />
                        <a :href="getLogoPath(selectedBrand.slug, 'pion', 'bialy')" download class="w-full py-2 bg-white/10 hover:bg-white hover:text-slate-900 text-white rounded-lg text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 relative z-10"><Download :size="14"/> Pobierz Białe</a>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-slate-50 border-t border-slate-100 text-center"><p class="text-[10px] text-slate-400">Format: SVG (Wektor). Obsługiwany przez drukarnie i pakiety biurowe.</p></div>
        </div>
    </div>
  </div>
</template>