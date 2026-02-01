<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useQrStore, THEMES } from '@/stores/qrStore';
import { 
  Download, Link, QrCode, Check, ScanLine, Fingerprint, 
   AlertCircle, Info, X, CheckCircle2,
  Hand, Sparkles, Monitor, Printer // Nowe ikony dla kontekstu
} from 'lucide-vue-next';
import AnimatedToolIcon from '@/components/common/AnimatedToolIcon.vue';

const qr = useQrStore();
const showTutorial = ref(true);

// Odśwież QR przy każdej zmianie w stanie
watch(
  () => [qr.input, qr.activeThemeId, qr.showLogo, qr.format], 
  () => { qr.generate(); },
  { deep: true }
);

onMounted(() => {
  qr.generate();
});
</script>

<template>
  <div class="flex flex-col lg:flex-row h-full w-full overflow-hidden relative bg-slate-50">
    
    <aside class="w-full lg:w-105 2xl:w-120 bg-white border-r border-slate-200 flex flex-col h-full z-20 shrink-0 shadow-xl lg:shadow-none lg:relative">
      
      <div class="p-6 pb-8 shrink-0 border-b border-slate-100 flex items-center gap-4">
        <div class="transform scale-75 origin-left shrink-0">
            <AnimatedToolIcon type="qr" />
        </div>
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Kreator Kodów QR</h2>
          <p class="text-xs text-slate-500 mt-1">Stwórz bezpieczny kod w 3 prostych krokach.</p>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
        
        <div class="space-y-10 pb-6">
          
          <div class="space-y-4">
            <label class="text-xs uppercase tracking-widest flex items-start gap-3 group">
              <span class="w-6 h-6 bg-teb-blue text-white rounded-full flex justify-center items-center text-[10px] font-bold shadow-sm shadow-blue-200 shrink-0 group-hover:scale-110 transition-transform">1</span> 
              <div>
                  <span class="block font-bold text-slate-700 group-hover:text-teb-blue transition-colors">Wklej link docelowy</span>
                  <span class="block text-[10px] text-slate-400 font-medium normal-case mt-0.5">To miejsce, gdzie trafi użytkownik po zeskanowaniu.</span>
              </div>
            </label>

            <div class="relative pl-9">
              <Link :size="16" class="absolute top-3.5 left-12 transition-colors z-10" :class="qr.isValid ? 'text-teb-blue' : 'text-slate-400'" />
              <input 
                v-model="qr.input" 
                type="text" 
                class="w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition font-medium shadow-sm"
                :class="!qr.isValid && qr.input.length > 0 ? 'border-red-300 bg-red-50 text-red-900' : 'bg-white border-slate-200 focus:ring-2 focus:ring-teb-blue focus:border-teb-blue text-slate-700'"
                placeholder="np. teb.pl/rekrutacja"
              />
              <AlertCircle v-if="!qr.isValid && qr.input.length > 0" :size="16" class="absolute top-3.5 right-3 text-red-400" />
              
              <div v-if="qr.isValid && qr.input" class="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-left-1">
                 <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 Link aktywny: <span class="text-emerald-600 font-bold truncate max-w-50">{{ qr.formattedUrl }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <label class="text-xs uppercase tracking-widest flex items-start gap-3 group">
                <span class="w-6 h-6 bg-teb-blue text-white rounded-full flex justify-center items-center text-[10px] font-bold shadow-sm shadow-blue-200 shrink-0 group-hover:scale-110 transition-transform">2</span>
                <div>
                    <span class="block font-bold text-slate-700 group-hover:text-teb-blue transition-colors">Dopasuj wygląd</span>
                    <span class="block text-[10px] text-slate-400 font-medium normal-case mt-0.5">Wybierz styl zgodny z tłem, na którym będzie kod.</span>
                </div>
            </label>
            
            <div class="pl-9 space-y-6">
                <div class="space-y-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Kolorystyka</span>
                    <div class="grid grid-cols-2 gap-3">
                        <button 
                          v-for="theme in THEMES" :key="theme.id" 
                          @click="qr.activeThemeId = theme.id"
                          class="p-3 rounded-xl border transition flex flex-col items-center justify-center gap-2 relative h-24 group cursor-pointer hover:shadow-md"
                          :class="qr.activeThemeId === theme.id ? 'border-teb-blue bg-blue-50/50 ring-1 ring-teb-blue' : 'border-slate-200 bg-white hover:border-teb-blue/30'"
                        >
                          <div class="w-8 h-8 rounded border shadow-sm flex items-center justify-center transition-transform group-hover:scale-110" :class="theme.previewClass">
                              <QrCode :size="16" />
                          </div>
                          <span class="text-xs font-bold text-slate-700">{{ theme.name }}</span>
                          <div v-if="qr.activeThemeId === theme.id" class="absolute top-2 right-2 text-teb-blue"><Check :size="14" stroke-width="3" /></div>
                        </button>
                    </div>
                </div>

                <div class="space-y-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Branding TEB</span>
                    <div class="grid grid-cols-2 gap-3">
                        <button 
                            @click="qr.showLogo = false"
                            class="p-3 rounded-xl border transition flex flex-col items-center justify-center gap-2 h-20 relative cursor-pointer hover:shadow-md"
                            :class="!qr.showLogo ? 'border-teb-blue bg-blue-50/50 ring-1 ring-teb-blue' : 'border-slate-200 bg-white hover:border-teb-blue/30'"
                        >
                            <ScanLine :size="20" class="text-slate-400" />
                            <span class="text-xs font-bold text-slate-700">Czysty kod</span>
                        </button>

                        <button 
                            @click="qr.showLogo = true"
                            class="p-3 rounded-xl border transition flex flex-col items-center justify-center gap-2 h-20 relative cursor-pointer hover:shadow-md"
                            :class="qr.showLogo ? 'border-teb-blue bg-blue-50/50 ring-1 ring-teb-blue' : 'border-slate-200 bg-white hover:border-teb-blue/30'"
                        >
                            <Fingerprint :size="20" class="text-teb-blue" />
                            <span class="text-xs font-bold text-slate-700">Z Logo</span>
                            <div v-if="qr.showLogo" class="absolute top-2 right-2 text-teb-blue"><Check :size="14" stroke-width="3" /></div>
                        </button>
                    </div>
                </div>
            </div>
          </div>

          <div class="space-y-4">
            <label class="text-xs uppercase tracking-widest flex items-start gap-3 group">
              <span class="w-6 h-6 bg-teb-blue text-white rounded-full flex justify-center items-center text-[10px] font-bold shadow-sm shadow-blue-200 shrink-0 group-hover:scale-110 transition-transform">3</span>
              <div>
                  <span class="block font-bold text-slate-700 group-hover:text-teb-blue transition-colors">Wybierz format pliku</span>
                  <span class="block text-[10px] text-slate-400 font-medium normal-case mt-0.5">Zdecyduj gdzie będziesz używać kodu.</span>
              </div>
            </label>
            
            <div class="pl-9 grid grid-cols-2 gap-3">
               <button 
                 @click="qr.format = 'png'" 
                 class="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group"
                 :class="qr.format === 'png' ? 'bg-blue-50 border-teb-blue text-teb-blue ring-1 ring-teb-blue' : 'bg-white border-slate-200 text-slate-500 hover:border-teb-blue/30'"
               >
                 <Monitor :size="20" />
                 <div class="text-center">
                    <span class="block text-xs font-bold">PNG</span>
                    <span class="block text-[9px] opacity-70">Internet / Sociale</span>
                 </div>
                 <div v-if="qr.format === 'png'" class="absolute inset-0 border-2 border-teb-blue rounded-xl opacity-10"></div>
               </button>

               <button 
                 @click="qr.format = 'svg'" 
                 class="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group"
                 :class="qr.format === 'svg' ? 'bg-blue-50 border-teb-blue text-teb-blue ring-1 ring-teb-blue' : 'bg-white border-slate-200 text-slate-500 hover:border-teb-blue/30'"
               >
                 <Printer :size="20" />
                 <div class="text-center">
                    <span class="block text-xs font-bold">SVG</span>
                    <span class="block text-[9px] opacity-70">Druk (Wektory)</span>
                 </div>
                 <div v-if="qr.format === 'svg'" class="absolute inset-0 border-2 border-teb-blue rounded-xl opacity-10"></div>
               </button>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100">
            <button 
              @click="qr.download" 
              :disabled="!qr.isValid || !qr.input"
              class="w-full text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] group relative overflow-hidden"
              :class="qr.isValid && qr.input ? 'bg-teb-blue hover:bg-teb-dark shadow-blue-900/20 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300/50'"
            >
              <div class="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

              <Download :size="20" class="relative z-10" />
              <span class="relative z-10">{{ qr.isValid && qr.input ? `Pobierz plik ${qr.format.toUpperCase()}` : 'Wpisz link powyżej' }}</span>
            </button>
            <p class="text-[10px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1.5">
               <Sparkles :size="12" class="text-teb-blue"/>
               System automatycznie sprawdza czytelność kodu.
            </p>
          </div>

        </div>
      </div>
    </aside>

    <main class="flex-1 bg-slate-50/50 p-4 md:p-8 overflow-y-auto h-full w-full relative">
        
        <div class="absolute inset-0 pointer-events-none transition-colors duration-500" :class="qr.activeTheme.id === 'reverse' ? 'bg-slate-200/50' : 'bg-slate-50'">
            <div class="absolute top-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl mix-blend-multiply"></div>
            <div class="absolute bottom-20 left-20 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl mix-blend-multiply"></div>
        </div>

        <div class="max-w-5xl mx-auto w-full relative z-10 flex flex-col h-full">
            
            <div v-if="showTutorial" class="mb-8 bg-linear-to-r from-teb-blue to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 shrink-0 group">
                <div class="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div class="hidden md:flex w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl items-center justify-center shrink-0 border border-white/20 shadow-sm"><Info :size="24" class="text-white" /></div>
                  <div class="flex-1 space-y-1">
                    <h3 class="text-lg font-bold text-white">Generator Kodów QR</h3>
                    <p class="text-sm text-blue-100 max-w-2xl leading-relaxed">
                      Twórz w pełni brandowane kody. Wybierz <strong>SVG</strong> dla drukarni (ulotki, plakaty) lub <strong>PNG</strong> do Internetu.
                    </p>
                    <div class="flex flex-wrap gap-2 mt-4">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-[11px] font-bold rounded-full uppercase tracking-wide border border-white/10">1. Wklej Link</span>
                      <div class="w-4 h-px bg-white/20 self-center"></div>
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-[11px] font-bold rounded-full uppercase tracking-wide border border-white/10">2. Wybierz Styl</span>
                      <div class="w-4 h-px bg-white/20 self-center"></div>
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-100 text-[11px] font-bold rounded-full uppercase tracking-wide border border-emerald-400/30"><CheckCircle2 :size="12" class="text-emerald-300" /> Pobierz</span>
                    </div>
                  </div>
                  <button @click="showTutorial = false" class="absolute top-4 right-4 p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer" title="Zamknij instrukcję"><X :size="20" /></button>
                </div>
             </div>

            <div class="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 mb-2 border-b border-slate-200/50 flex items-center justify-between rounded-t-2xl px-2 shrink-0">
                 <div>
                   <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                     Podgląd na żywo
                     <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100" v-if="qr.isValid">Kod Aktywny</span>
                   </h3>
                   <p class="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                     <Hand :size="14" class="text-teb-blue animate-pulse" /> 
                     Wskazówka: Przed drukiem zawsze zeskanuj kod telefonem na próbę.
                   </p>
                 </div>
            </div>

            <div class="flex-1 flex flex-col items-center justify-center min-h-0 pb-12">
                <div 
                  class="p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 transition-all duration-300 transform border relative group bg-white"
                  :class="[
                     qr.isValid && qr.input ? 'scale-100 opacity-100' : 'scale-95 opacity-50 blur-[1px] grayscale',
                     qr.activeTheme.id === 'reverse' ? 'border-teb-blue ring-8 ring-teb-blue/10' : 'border-white ring-8 ring-slate-200/50'
                  ]"
                >
                    <img 
                      v-if="qr.dataUrl && qr.isValid" 
                      :src="qr.dataUrl" 
                      alt="QR Code" 
                      class="w-64 h-64 md:w-80 md:h-80 object-contain mix-blend-multiply" 
                    />
                    
                    <div v-else class="w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center gap-4 text-slate-300">
                        <QrCode :size="80" class="opacity-20" />
                        <span class="text-xs font-medium text-center opacity-60">Wpisz link w panelu,<br>aby wygenerować kod.</span>
                    </div>
                </div>

                <div 
                  v-if="qr.isValid && qr.input" 
                  class="mt-8 text-sm font-bold px-6 py-2.5 rounded-full backdrop-blur-md border shadow-sm flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-500"
                  :class="qr.activeTheme.id === 'reverse' ? 'bg-white/90 text-teb-blue border-white' : 'bg-white/80 text-slate-600 border-white/50'"
                >
                    <Link :size="14" />
                    {{ qr.formattedUrl }}
                </div>
            </div>

        </div>
    </main>
  </div>
</template>