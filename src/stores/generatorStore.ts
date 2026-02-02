// src/stores/generatorStore.ts
import { defineStore } from 'pinia';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SZKOLENIA_CONFIG, type FormatConfig } from '@/core/config';

// Twój poprawiony helper
const getClientPos = (e: MouseEvent | TouchEvent) => {
    // Sprawdzamy czy to TouchEvent w sposób zrozumiały dla TS
    if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) {
            return { x: touch.clientX, y: touch.clientY };
        }
    }
    // W przeciwnym razie traktujemy jako MouseEvent
    const mouseEvent = e as MouseEvent;
    return { x: mouseEvent.clientX, y: mouseEvent.clientY };
};

export const useGeneratorStore = defineStore('generator', {
    state: () => ({
        bgImage: null as HTMLImageElement | null,
        text: '',
        canvases: {} as Record<string, HTMLCanvasElement>,
        overlays: {} as Record<string, HTMLImageElement>,
        offsets: {} as Record<string, { x: number, y: number }>,
        
        // Stan interakcji
        isLoaded: false,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        activeCanvasId: null as string | null,
        initialOffset: { x: 0, y: 0 }
    }),

    actions: {
        async init(container: HTMLElement) {
            this.isLoaded = false;
            this.canvases = {};
            container.innerHTML = '';

            await Promise.all([
                this.loadOverlays(),
                document.fonts.ready 
            ]);

            SZKOLENIA_CONFIG.forEach(cfg => {
                // NOWY STYL KONTENERA: Bardziej "lekki", większy cień, hover effect
                const wrapper = document.createElement('div');
                wrapper.className = "bg-white p-4 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col gap-3 relative group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300";
                
                const canvas = document.createElement('canvas');
                canvas.width = cfg.w;
                canvas.height = cfg.h;
                // Dodano border-slate-50 do canvasa
                canvas.className = "w-full h-auto rounded-xl shadow-sm border border-slate-50 bg-slate-100 cursor-grab active:cursor-grabbing touch-none transition-transform group-hover:scale-[1.01]";
                
                // NOWY STYL LABELA: Wyraźniejszy
                const label = document.createElement('div');
                label.className = "flex justify-between items-center";
                label.innerHTML = `
                    <span class="text-xs font-bold text-slate-700">${cfg.name}</span> 
                    <span class="bg-slate-50 px-2 py-1 rounded-md text-[10px] font-mono font-medium text-slate-400 border border-slate-100">${cfg.w}x${cfg.h}</span>
                `;
                canvas.addEventListener('mousedown', (e) => this.startDrag(e, cfg.id));
                canvas.addEventListener('touchstart', (e) => this.startDrag(e, cfg.id), { passive: false });

                wrapper.appendChild(label);
                wrapper.appendChild(canvas);
                container.appendChild(wrapper);

                this.canvases[cfg.id] = canvas;
                if (!this.offsets[cfg.id]) {
                    this.offsets[cfg.id] = { x: 0, y: 0 };
                }
            });

            window.addEventListener('mouseup', this.stopDrag);
            window.addEventListener('touchend', this.stopDrag);
            window.addEventListener('mousemove', this.onDrag);
            window.addEventListener('touchmove', this.onDrag, { passive: false });

            this.isLoaded = true;
            this.draw();
        },

        // --- DRAG & DROP Z OGRANICZENIEM (CLAMP) ---
        startDrag(e: MouseEvent | TouchEvent, id: string) {
            // Guard clauses: Sprawdzamy czy wszystko istnieje
            const offset = this.offsets[id];
            if (!this.bgImage || !offset) return;

            e.preventDefault(); 
            
            this.isDragging = true;
            this.activeCanvasId = id;
            
            const pos = getClientPos(e);
            this.dragStart = { x: pos.x, y: pos.y };
            
            // Kopiujemy wartości bezpiecznie
            this.initialOffset = { x: offset.x, y: offset.y };
            
            const canvas = this.canvases[id];
            if (canvas) {
                canvas.style.cursor = 'grabbing';
            }
        },

        onDrag(e: MouseEvent | TouchEvent) {
            // Guard clause dla stanu globalnego
            if (!this.isDragging || !this.activeCanvasId || !this.bgImage) return;

            // Guard clause dla konkretnych obiektów
            const canvas = this.canvases[this.activeCanvasId];
            const cfg = SZKOLENIA_CONFIG.find(c => c.id === this.activeCanvasId);
            const currentOffset = this.offsets[this.activeCanvasId];

            // Jeśli czegokolwiek brakuje, przerywamy
            if (!canvas || !currentOffset || !cfg) return;

            e.preventDefault();

            const pos = getClientPos(e);
            const dx = pos.x - this.dragStart.x;
            const dy = pos.y - this.dragStart.y;

            const rect = canvas.getBoundingClientRect();
            const scaleX = rect.width ? canvas.width / rect.width : 1;
            const scaleY = rect.height ? canvas.height / rect.height : 1;

            // Obliczamy nowe potencjalne przesunięcie
            let newOffsetX = this.initialOffset.x - (dx * scaleX);
            let newOffsetY = this.initialOffset.y - (dy * scaleY);

            // --- LOGIKA CLAMP (Blokada "dziur") ---
            const areaW = cfg.w;
            const areaH = cfg.photoHeight || cfg.h;
            
            // Skala, w jakiej zdjęcie jest aktualnie narysowane
            const imgScale = Math.max(areaW / this.bgImage.width, areaH / this.bgImage.height);
            const dw = this.bgImage.width * imgScale;
            const dh = this.bgImage.height * imgScale;

            // Obliczamy maksymalne dopuszczalne przesunięcie od środka w każdą stronę
            // (SzerokośćRysowana - SzerokośćRamki) / 2
            const maxOffsetX = (dw - areaW) / 2;
            const maxOffsetY = (dh - areaH) / 2;

            // Aplikujemy ograniczenie (Math.max i Math.min)
            // Upewniamy się, że maxOffset nie jest ujemny (zabezpieczenie)
            const clampX = Math.max(0, maxOffsetX);
            const clampY = Math.max(0, maxOffsetY);

            newOffsetX = Math.max(-clampX, Math.min(clampX, newOffsetX));
            newOffsetY = Math.max(-clampY, Math.min(clampY, newOffsetY));

            // Zapisujemy do stanu
            this.offsets[this.activeCanvasId] = {
                x: newOffsetX,
                y: newOffsetY
            };

            this.draw();
        },

        stopDrag() {
            this.isDragging = false;
            // Bezpieczny dostęp
            if (this.activeCanvasId) {
                const canvas = this.canvases[this.activeCanvasId];
                if (canvas) {
                    canvas.style.cursor = 'grab';
                }
            }
            this.activeCanvasId = null;
        },

        // --- LOGIKA GŁÓWNA ---

        async loadOverlays() {
            const promises = SZKOLENIA_CONFIG.map(cfg => {
                return new Promise<void>((resolve) => {
                    if (!cfg.overlay) return resolve();
                    
                    const img = new Image();
                    // ZMIANA: Dodajemy import.meta.env.BASE_URL przed ścieżką
                    // Usuwamy też ewentualny slash na początku cfg.overlay, żeby nie dublować
                    const cleanPath = cfg.overlay.startsWith('/') ? cfg.overlay.slice(1) : cfg.overlay;
                    img.src = `${import.meta.env.BASE_URL}${cleanPath}`;
                    
                    img.onload = () => { this.overlays[cfg.id] = img; resolve(); };
                    img.onerror = () => { 
                        console.error(`Błąd ładowania tła: ${img.src}`);
                        resolve(); 
                    };
                });
            });
            return Promise.all(promises);
        },

        setBackgroundImage(src: string) {
            if (!src) {
                this.bgImage = null;
                this.draw();
                return;
            }

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                this.bgImage = img;
                SZKOLENIA_CONFIG.forEach(cfg => this.offsets[cfg.id] = { x: 0, y: 0 });
                this.draw();
            };
            img.src = src;
        },

        updateText(newText: string) {
            this.text = newText;
            this.draw();
        },

        downloadZip() {
            const zip = new JSZip();
            const safeName = this.text.replace(/[^a-z0-9]/gi, '_').slice(0, 20) || "TEB_Grafiki";
            
            SZKOLENIA_CONFIG.forEach(cfg => {
                const canvas = this.canvases[cfg.id];
                if (canvas) {
                    const dataUrl = canvas.toDataURL('image/png');
                    const data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
                    zip.file(`${safeName}_${cfg.name.replace(/\s/g, '_')}.png`, data, {base64: true});
                }
            });

            zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, `${safeName}_paczka.zip`);
            });
        },

        draw() {
            if (!this.isLoaded) return;

            SZKOLENIA_CONFIG.forEach(cfg => {
                const canvas = this.canvases[cfg.id];
                const ctx = canvas?.getContext('2d');
                if (!ctx) return;

                ctx.clearRect(0, 0, cfg.w, cfg.h);

                if (this.bgImage) {
                    this.drawUserImage(ctx, cfg);
                } else {
                    this.drawPlaceholder(ctx, cfg);
                }

                const overlay = this.overlays[cfg.id];
                if (overlay) {
                    ctx.drawImage(overlay, 0, 0, cfg.w, cfg.h);
                }

                if (cfg.hasText && this.text) {
                    this.drawConfigText(ctx, cfg);
                }
            });
        },

        drawUserImage(ctx: CanvasRenderingContext2D, cfg: FormatConfig) {
            if (!this.bgImage) return;
            // Bezpieczny fallback dla offsetu
            const offset = this.offsets[cfg.id] || { x: 0, y: 0 };
            
            const areaH = cfg.photoHeight || cfg.h;
            const areaW = cfg.w;

            const scale = Math.max(areaW / this.bgImage.width, areaH / this.bgImage.height);
            const dw = this.bgImage.width * scale;
            const dh = this.bgImage.height * scale;

            const x = (areaW - dw) / 2 - offset.x; 
            const y = (areaH - dh) / 2 - offset.y;

            ctx.drawImage(this.bgImage, x, y, dw, dh);
        },

        drawConfigText(ctx: CanvasRenderingContext2D, cfg: FormatConfig) {
            const fontSize = cfg.fontSize || 40;
            const lineHeight = cfg.lineHeight || 1.1;
            
            ctx.fillStyle = cfg.textColor || '#1D1D1B';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            // Roc Grotesk Bold, bez Wide
            ctx.font = `700 ${fontSize}px "Roc Grotesk", "Inter", sans-serif`;

            const maxWidth = cfg.maxWidth || (cfg.w - (cfg.textX || 40) * 2);
            
            const paragraphs = this.text.split('\n');
            let allLines: string[] = [];

            paragraphs.forEach(para => {
                const words = para.trim().split(' ');
                
                // POPRAWKA BŁĘDU TS (string | undefined): 
                // Inicjujemy pustym stringiem, jeśli słowo nie istnieje
                let currentLine = words[0] || "";

                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    if (!word) continue; // Pomijamy puste (np. podwójne spacje)
                    
                    const width = ctx.measureText(currentLine + " " + word).width;
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        allLines.push(currentLine);
                        currentLine = word;
                    }
                }
                // Dodajemy linię tylko jeśli coś w niej jest
                if(currentLine) allLines.push(currentLine);
            });

            const maxLinesAllowed = cfg.maxLines || 3;
            if (allLines.length > maxLinesAllowed) {
                allLines = allLines.slice(0, maxLinesAllowed);
                // Sprawdzamy czy ostatni element istnieje przed modyfikacją
                if (allLines[maxLinesAllowed - 1]) {
                    allLines[maxLinesAllowed - 1] += "...";
                }
            }

            const lhPx = fontSize * lineHeight;
            allLines.forEach((lineText, i) => {
                ctx.fillText(
                    lineText.trim(), 
                    cfg.textX || 40, 
                    (cfg.textY || 40) + (i * lhPx)
                );
            });
        },

        drawPlaceholder(ctx: CanvasRenderingContext2D, cfg: FormatConfig) {
            const h = cfg.photoHeight || cfg.h;
            ctx.fillStyle = '#F1F5F9';
            ctx.fillRect(0, 0, cfg.w, h);
            
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0,0); ctx.lineTo(cfg.w, h);
            ctx.moveTo(cfg.w, 0); ctx.lineTo(0, h);
            ctx.stroke();

            ctx.fillStyle = '#94A3B8';
            ctx.font = 'bold 16px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("MIEJSCE NA ZDJĘCIE", cfg.w / 2, h / 2);
        }
    }
});