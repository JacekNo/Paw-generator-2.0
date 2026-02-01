<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { 
  Download, Upload, RefreshCw, Trash2, ImageIcon, ChevronRight, AlertTriangle, Info, X, CheckCircle2, 
  Hand, Sparkles // Nowe ikony
} from 'lucide-vue-next';
import { useGeneratorStore } from '@/stores/generatorStore';
import ImageGalleryModal from '@/components/ImageGalleryModal.vue';
  import AnimatedToolIcon from '@/components/common/AnimatedToolIcon.vue'; // Import animacji

const generator = useGeneratorStore();
const canvasContainer = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Stan tekstu
const textInput = ref('');
const MAX_CHARS = 60; 
const MAX_LINES = 3;

// Stan obrazka
const isImageReady = ref(false);
const uploadedImageSrc = ref('');
const imageSource = ref<'disk' | 'gallery'>('disk');
const isGalleryOpen = ref(false);

// Flow Weryfikacji
const uploadState = ref<'idle' | 'warning' | 'verifying'>('idle');
const verificationProgress = ref(0);
const uploadError = ref<string | null>(null);
let verificationInterval: any = null;

// Tutorial
const showTutorial = ref(true);

// Walidacja
const charCount = computed(() => textInput.value.length);
const isTextTooLong = computed(() => charCount.value > MAX_CHARS);
const lines = computed(() => textInput.value.split('\n'));
const isTooManyLines = computed(() => lines.value.length > MAX_LINES);
const hasLongWord = computed(() => textInput.value.split(/\s+/).some(word => word.length > 18));

const canDownload = computed(() => 
  isImageReady.value && 
  textInput.value.length > 0 && 
  !isTextTooLong.value && 
  !isTooManyLines.value && 
  !hasLongWord.value
);

const inputBorderClass = computed(() => {
  if (isTextTooLong.value || isTooManyLines.value || hasLongWord.value) return 'border-red-300 bg-red-50 text-red-900 focus:ring-red-200';
  if (textInput.value.length > 0) return 'border-teb-blue bg-blue-50 focus:ring-teb-blue focus:bg-white';
  return 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-teb-blue focus:bg-white';
});

// --- OBSŁUGA ---
// (Logika uploadu bez zmian - skrócona dla czytelności wklejki)
const handleGallerySelect = (imagePath: string) => {
  imageSource.value = 'gallery';
  uploadedImageSrc.value = imagePath;
  isImageReady.value = true;
  isGalleryOpen.value = false;
  uploadState.value = 'idle'; 
  uploadError.value = null;
  generator.setBackgroundImage(imagePath);
};

const initiateUploadSequence = () => { uploadState.value = 'warning'; uploadError.value = null; };
const openFileSystem = () => { fileInputRef.value?.click(); };

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target?.result as string;
    const img = new Image();
    img.onload = () => {
      if (img.width < 800 || img.height < 800) {
        uploadError.value = `Zdjęcie jest za małe (${img.width}x${img.height}). Min. 800px.`;
        uploadState.value = 'idle';
      } else {
        uploadedImageSrc.value = src;
        imageSource.value = 'disk';
        uploadState.value = 'verifying';
        startVerification();
      }
    };
    img.src = src;
  };
  reader.readAsDataURL(file);
  target.value = '';
};

const startVerification = () => {
  verificationProgress.value = 0;
  if (verificationInterval) clearInterval(verificationInterval);
  verificationInterval = setInterval(() => {
    verificationProgress.value += 10;
    if (verificationProgress.value >= 100) { clearInterval(verificationInterval); finishUpload(); }
  }, 100);
};

const finishUpload = () => { isImageReady.value = true; uploadState.value = 'idle'; generator.setBackgroundImage(uploadedImageSrc.value); };
const removeImage = () => { isImageReady.value = false; uploadedImageSrc.value = ''; uploadState.value = 'idle'; uploadError.value = null; generator.setBackgroundImage(''); };

onMounted(async () => {
  await nextTick();
  if (canvasContainer.value) generator.init(canvasContainer.value);
});

watch(textInput, (newVal) => generator.updateText(newVal));
</script>

<template>
  <div class="flex flex-col lg:flex-row h-full w-full overflow-hidden relative bg-slate-50">
    <input ref="fileInputRef" type="file" @change="handleFileUpload" accept="image/*" class="hidden" />

    <ImageGalleryModal v-if="isGalleryOpen" @close="isGalleryOpen = false" @select="handleGallerySelect" />

    <aside class="w-full lg:w-105 2xl:w-120 bg-white border-r border-slate-200 flex flex-col h-full z-20 shrink-0 shadow-xl lg:shadow-none lg:relative">
      
      <div class="p-6 pb-8 shrink-0 border-b border-slate-100 flex items-center gap-4">
        <div class="transform scale-75 origin-left shrink-0">
            <AnimatedToolIcon type="generator" />
        </div>
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Kreator Postów</h2>
          <p class="text-xs text-slate-500 mt-1">Stwórzmy razem świetną grafikę w 3 krokach.</p>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
        
        <div class="space-y-10 pb-6">
          
          <div class="space-y-4">
            <label class="text-xs uppercase tracking-widest flex items-start gap-3 group">
              <span class="w-6 h-6 bg-teb-blue text-white rounded-full flex justify-center items-center text-[10px] font-bold shadow-sm shadow-blue-200 shrink-0 group-hover:scale-110 transition-transform">1</span> 
              <div>
                  <span class="block font-bold text-slate-700 group-hover:text-teb-blue transition-colors">Wybierz tło grafiki</span>
                  <span class="block text-[10px] text-slate-400 font-medium normal-case mt-0.5">To fundament, który przyciągnie uwagę.</span>
              </div>
            </label>
            
            <div class="flex flex-col gap-4 pl-9">
                <button @click="isGalleryOpen = true" class="w-full bg-linear-to-br from-teb-blue to-blue-600 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group active:scale-[0.98]">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/10"><ImageIcon :size="20"/></div>
                    <div><div class="font-bold text-sm">Otwórz Bazę Zdjęć</div><div class="text-[10px] text-blue-100">Profesjonalne, gotowe zdjęcia</div></div>
                  </div>
                  <ChevronRight :size="18" class="group-hover:translate-x-1 transition text-blue-200" />
                </button>

                <div class="relative py-2 text-center"><span class="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase relative z-10">lub wgraj własne</span><div class="absolute inset-0 flex items-center"><span class="w-full border-t border-slate-100"></span></div></div>

                <div class="relative h-40 w-full transition-all duration-300"> 
                  <div v-if="!isImageReady && uploadState === 'idle'" @click="initiateUploadSequence" class="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-teb-blue group transition bg-white">
                    <div class="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition"><Upload :size="20" class="text-slate-400 group-hover:text-teb-blue"/></div>
                    <div class="text-center"><span class="block text-xs font-bold text-slate-700">Wgraj plik z dysku</span><span class="text-[10px] text-slate-400">Tylko wysoka jakość</span></div>
                    <div v-if="uploadError" class="mt-2 text-[10px] text-red-500 font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded"><AlertTriangle :size="12"/> {{ uploadError }}</div>
                  </div>
                  
                  <div v-else-if="uploadState === 'warning'" class="h-full bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex flex-col items-center text-center justify-center gap-3 animate-in fade-in zoom-in-95">
                    <AlertTriangle :size="24" class="text-amber-500" />
                    <div><h4 class="text-sm font-bold text-amber-900">Chwila refleksji.</h4><p class="text-[10px] text-amber-700 mt-1 leading-tight">Czy zdjęcie jest ostre, profesjonalne i masz do niego prawa?</p></div>
                    <div class="flex gap-2 w-full mt-1"><button @click="uploadState = 'idle'" class="flex-1 py-2 text-[10px] font-bold text-slate-500 hover:bg-amber-100 rounded-lg transition">Wróć</button><button @click="openFileSystem" class="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg shadow-sm transition">Tak, jest ok</button></div>
                  </div>

                  <div v-else-if="uploadState === 'verifying'" class="h-full bg-white border-2 border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center gap-4">
                    <div class="w-full space-y-2"><div class="flex justify-between text-[10px] font-bold text-slate-500"><span>Sprawdzam jakość...</span><span>{{ verificationProgress }}%</span></div><div class="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-teb-blue transition-all duration-100 ease-out" :style="{ width: verificationProgress + '%' }"></div></div></div>
                  </div>

                  <div v-else-if="isImageReady" class="h-full w-full rounded-xl overflow-hidden relative group border border-slate-200 shadow-sm">
                    <img :src="uploadedImageSrc" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button @click="initiateUploadSequence" class="px-4 py-2 bg-white rounded-full text-[10px] font-bold text-slate-700 hover:text-teb-blue hover:scale-105 transition shadow-lg flex gap-2"><RefreshCw :size="12"/> Zmień</button>
                      <button @click="removeImage" class="px-4 py-2 bg-white/10 border border-white/30 rounded-full text-[10px] font-bold text-white hover:bg-red-500 hover:border-red-500 hover:scale-105 transition shadow-lg flex gap-2"><Trash2 :size="12"/> Usuń</button>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div class="space-y-4">
            <label class="text-xs uppercase tracking-widest flex items-start justify-between gap-3 group">
              <div class="flex items-start gap-3">
                  <span class="w-6 h-6 bg-teb-blue text-white rounded-full flex justify-center items-center text-[10px] font-bold shadow-sm shadow-blue-200 shrink-0 group-hover:scale-110 transition-transform">2</span> 
                  <div>
                      <span class="block font-bold text-slate-700 group-hover:text-teb-blue transition-colors">Wpisz treść</span>
                      <span class="block text-[10px] text-slate-400 font-medium normal-case mt-0.5">Nazwa kierunku lub główne hasło.</span>
                  </div>
              </div>
              <span class="font-mono text-[10px] mt-1" :class="isTextTooLong ? 'text-red-500 font-bold' : 'text-slate-300'">{{ charCount }}/{{ MAX_CHARS }}</span>
            </label>

            <div class="relative pl-9">
              <textarea 
                v-model="textInput"
                :class="inputBorderClass"
                class="w-full p-4 border rounded-xl text-sm outline-none transition min-h-36 resize-none shadow-sm text-slate-700 font-medium placeholder:text-slate-300 placeholder:font-normal"
                placeholder="np. Technik Informatyk&#10;z elementami e-sportu"
              ></textarea>
              <div class="absolute bottom-3 right-3 flex flex-col items-end gap-1 pointer-events-none">
                 <div v-if="isTooManyLines" class="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-100 animate-pulse shadow-sm">Max 3 linie!</div>
                 <div v-if="hasLongWord" class="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-100 animate-pulse shadow-sm">Słowo jest za długie!</div>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100">
            <button 
              @click="canDownload && generator?.downloadZip()" 
              :disabled="!canDownload"
              :class="canDownload 
                ? 'bg-teb-blue hover:bg-teb-dark shadow-lg shadow-blue-900/20 active:scale-[0.98] cursor-pointer' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'"
              class="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group relative overflow-hidden"
            >
              <div class="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              
              <Download :size="20" class="relative z-10" />
              <span class="relative z-10">{{ canDownload ? 'Pobierz gotową paczkę' : 'Uzupełnij dane powyżej' }}</span>
            </button>
            <p class="text-[10px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1.5">
              <Sparkles :size="12" class="text-teb-blue"/>
              Generujemy automatycznie 5 formatów social media.
            </p>
          </div>

        </div>
      </div>
    </aside>

    <main class="flex-1 bg-slate-50/50 p-4 md:p-8 overflow-y-auto h-full w-full relative">
       <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div class="absolute top-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl mix-blend-multiply"></div>
          <div class="absolute bottom-20 left-20 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl mix-blend-multiply"></div>
       </div>

      <div class="max-w-7xl mx-auto w-full relative z-10">
         
         <div v-if="showTutorial" class="mb-8 bg-linear-to-r from-teb-blue to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 group shrink-0">
            <div class="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div class="hidden md:flex w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl items-center justify-center shrink-0 border border-white/20 shadow-sm"><Info :size="24" class="text-white" /></div>
              <div class="flex-1 space-y-1">
                <h3 class="text-lg font-bold text-white">Jak to działa?</h3>
                <p class="text-sm text-blue-100 max-w-2xl leading-relaxed">Generator automatycznie tworzy grafiki we wszystkich potrzebnych formatach. Dostosuj zdjęcie i tekst po lewej stronie, a następnie pobierz gotową paczkę ZIP.</p>
                <div class="flex flex-wrap gap-2 mt-4">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-[11px] font-bold rounded-full uppercase tracking-wide border border-white/10">1. Wybierz tło</span>
                  <div class="w-4 h-px bg-white/20 self-center"></div>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-[11px] font-bold rounded-full uppercase tracking-wide border border-white/10">2. Wpisz Tekst</span>
                  <div class="w-4 h-px bg-white/20 self-center"></div>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-100 text-[11px] font-bold rounded-full uppercase tracking-wide border border-emerald-400/30"><CheckCircle2 :size="12" class="text-emerald-300" /> Pobierz</span>
                </div>
              </div>
              <button @click="showTutorial = false" class="absolute top-4 right-4 p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer" title="Zamknij instrukcję"><X :size="20" /></button>
            </div>
         </div>
        
         <div class="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 mb-6 border-b border-slate-200/50 flex items-center justify-between rounded-t-2xl px-2">
             <div>
               <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                 Podgląd na żywo
                 <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-teb-blue border border-blue-100">5 formatów</span>
               </h3>
               <p class="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                 <Hand :size="14" class="text-teb-blue animate-pulse" /> 
                 Wskazówka: Możesz przesuwać zdjęcie myszką bezpośrednio na podglądzie.
               </p>
             </div>
         </div>

         <div ref="canvasContainer" class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 pb-20 justify-items-center items-start">
         </div>
         
      </div>
    </main>
  </div>
</template>