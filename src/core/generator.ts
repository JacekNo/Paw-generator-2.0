import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { FormatConfig } from './config';

export class GraphicGenerator {
    configs: FormatConfig[];
    
    // Stan wewnętrzny
    userImage: HTMLImageElement | null = null;
    currentText: string = "";
    offsets: { [key: string]: { x: number, y: number } } = {};
    overlaysLoaded: { [key: string]: HTMLImageElement } = {};
    
    // Uchwyty do Canvasów
    canvases: { [key: string]: HTMLCanvasElement } = {};
    contexts: { [key: string]: CanvasRenderingContext2D } = {};
    
    constructor(configs: FormatConfig[]) {
        this.configs = configs;
        this.configs.forEach(cfg => {
            this.offsets[cfg.id] = { x: 0, y: 0 };
        });
    }

    async init(container: HTMLElement) {
        container.innerHTML = ''; 
        await this.loadOverlays();

        this.configs.forEach(cfg => {
            // Wrapper
            const wrapper = document.createElement('div');
            wrapper.className = "bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2 relative group hover:shadow-md transition-shadow";
            
            // Header
            const header = document.createElement('div');
            header.className = "flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider";
            header.innerHTML = `<span>${cfg.name}</span> <span class="bg-slate-50 px-1.5 py-0.5 rounded text-slate-300 border border-slate-100">${cfg.w}x${cfg.h}</span>`;
            wrapper.appendChild(header);

            // Canvas Container
            const canvasWrapper = document.createElement('div');
            canvasWrapper.className = "relative w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-100";
            
            // Canvas
            const canvas = document.createElement('canvas');
            canvas.width = cfg.w;
            canvas.height = cfg.h;
            canvas.className = "w-full h-auto cursor-grab active:cursor-grabbing block"; 
            
            canvasWrapper.appendChild(canvas);
            wrapper.appendChild(canvasWrapper);
            container.appendChild(wrapper);

            // Context
            this.canvases[cfg.id] = canvas;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                this.contexts[cfg.id] = ctx;
                this.drawPlaceholder(ctx, cfg);
            }

            this.setupDrag(canvas, cfg.id);
        });

        document.fonts.ready.then(() => this.redrawAll());
    }

    async loadOverlays() {
        const promises = this.configs.map(cfg => {
            return new Promise<void>((resolve) => {
                if (!cfg.overlay) { resolve(); return; }
                const img = new Image();
                img.src = cfg.overlay;
                img.onload = () => { this.overlaysLoaded[cfg.id] = img; resolve(); };
                img.onerror = () => { console.warn('Brak overlay:', cfg.overlay); resolve(); };
            });
        });
        return Promise.all(promises);
    }

    // --- PUBLIC METHODS ---

    setUserImage(img: HTMLImageElement) {
        this.userImage = img;
        Object.keys(this.offsets).forEach(k => this.offsets[k] = { x: 0, y: 0 });
        this.redrawAll();
    }

    updateText(text: string) {
        this.currentText = text;
        this.redrawAll();
    }

    downloadZip(filename: string = "TEB_Grafiki") {
        const zip = new JSZip();
        let count = 0;
        const total = this.configs.length;
        const safeName = filename.replace(/[^a-z0-9ąćęłńóśźż\s-]/gi, '').trim() || "Grafiki";

        this.configs.forEach(cfg => {
            const canvas = this.canvases[cfg.id];
            if (!canvas) return;

            canvas.toBlob(blob => {
                if (blob) {
                    zip.file(`${safeName}_${cfg.id}.png`, blob);
                }
                count++;
                if (count === total) {
                    zip.generateAsync({ type: "blob" }).then(content => {
                        saveAs(content, `TEB_${safeName}.zip`);
                    });
                }
            });
        });
    }

    // --- CORE LOGIC ---

    private redrawAll() {
        this.configs.forEach(cfg => {
            const ctx = this.contexts[cfg.id];
            if (!ctx) return;

            ctx.clearRect(0, 0, cfg.w, cfg.h);

            if (this.userImage) {
                this.drawImageWithClamp(ctx, cfg);
            } else {
                this.drawPlaceholder(ctx, cfg);
            }

            const overlayImg = this.overlaysLoaded[cfg.id];
            if (overlayImg) {
                ctx.drawImage(overlayImg, 0, 0, cfg.w, cfg.h);
            }

            if (cfg.hasText && this.currentText) {
                this.drawText(ctx, cfg);
            }
        });
    }

    private drawImageWithClamp(ctx: CanvasRenderingContext2D, cfg: FormatConfig) {
        if (!this.userImage) return;

        // Bezpiecznie pobieramy referencję do obiektu
        const offset = this.offsets[cfg.id];
        if (!offset) return; 

        const areaH = cfg.photoHeight || cfg.h;
        const areaW = cfg.w;

        const scale = Math.max(areaW / this.userImage.width, areaH / this.userImage.height);
        const dw = this.userImage.width * scale;
        const dh = this.userImage.height * scale;

        const baseX = (areaW - dw) / 2;
        const baseY = (areaH - dh) / 2;

        const minX = areaW - dw;
        const maxX = 0;
        const minY = areaH - dh;
        const maxY = 0;

        // Używamy zmiennej 'offset', którą sprawdziliśmy wyżej
        let targetX = baseX + offset.x; 
        let targetY = baseY + offset.y;

        const clampedX = Math.min(Math.max(targetX, minX), maxX);
        const clampedY = Math.min(Math.max(targetY, minY), maxY);

        // POPRAWKA 1: Modyfikujemy obiekt przez referencję 'offset'
        // Zamiast this.offsets[cfg.id], co gubi typowanie
        offset.x = clampedX - baseX;
        offset.y = clampedY - baseY;

        ctx.drawImage(this.userImage, clampedX, clampedY, dw, dh);
    }

    private drawText(ctx: CanvasRenderingContext2D, cfg: FormatConfig) {
        const fontSize = cfg.fontSize || 36;
        const lineHeight = cfg.lineHeight || 1.2;
        
        ctx.fillStyle = cfg.textColor || '#1D1D1B';
        ctx.font = `bold ${fontSize}pt "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const lines = this.calculateLines(ctx, this.currentText, cfg.maxWidth || cfg.w);
        const maxLines = cfg.maxLines || 3;
        const visibleLines = lines.slice(0, maxLines);
        
        if (lines.length > maxLines) {
            let last = visibleLines[maxLines - 1];
            // Sprawdzamy czy last istnieje (na wypadek pustej tablicy)
            if (last) {
                while (ctx.measureText(last + "...").width > (cfg.maxWidth || cfg.w) && last.length > 0) {
                    last = last.slice(0, -1);
                }
                visibleLines[maxLines - 1] = last + "...";
            }
        }

        const lhPx = fontSize * 1.33 * lineHeight;
        visibleLines.forEach((line, i) => {
            ctx.fillText(line.trim(), cfg.textX || 0, (cfg.textY || 0) + (i * lhPx));
        });
    }

    private drawPlaceholder(ctx: CanvasRenderingContext2D, cfg: FormatConfig) {
        const h = cfg.photoHeight || cfg.h;
        ctx.fillStyle = '#F1F5F9'; 
        ctx.fillRect(0, 0, cfg.w, h);
        
        ctx.beginPath();
        ctx.strokeStyle = '#E2E8F0'; 
        ctx.lineWidth = 2;
        ctx.moveTo(0, 0); ctx.lineTo(cfg.w, h);
        ctx.moveTo(cfg.w, 0); ctx.lineTo(0, h);
        ctx.stroke();

        ctx.fillStyle = '#94A3B8'; 
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("MIEJSCE NA ZDJĘCIE", cfg.w / 2, h / 2);

        if (cfg.photoHeight && cfg.photoHeight < cfg.h) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, cfg.photoHeight, cfg.w, cfg.h - cfg.photoHeight);
        }
    }

    private calculateLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
        const paragraphs = text.split('\n');
        let lines: string[] = [];

        paragraphs.forEach(para => {
            const words = para.split(' ');
            
            // POPRAWKA 2: Zabezpieczenie przed undefined
            let currentLine = words[0] || ""; 

            for (let i = 1; i < words.length; i++) {
                // POPRAWKA 3: Zabezpieczenie przed undefined w pętli
                const word = words[i] || "";
                
                const width = ctx.measureText(currentLine + " " + word).width;
                if (width < maxWidth) {
                    currentLine += " " + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine) lines.push(currentLine);
        });
        return lines;
    }

    private setupDrag(canvas: HTMLCanvasElement, id: string) {
        let isDown = false;
        let startX = 0, startY = 0;

        canvas.addEventListener('mousedown', e => {
            if (!this.userImage) return;
            isDown = true;
            startX = e.offsetX;
            startY = e.offsetY;
            canvas.style.cursor = 'grabbing';
        });

        window.addEventListener('mouseup', () => {
            isDown = false;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('mousemove', e => {
            if (!isDown || !this.userImage) return;
            const dx = e.offsetX - startX;
            const dy = e.offsetY - startY;
            
            // Tutaj też używamy bezpiecznego sprawdzenia
            const offset = this.offsets[id];
            if (offset) {
                offset.x += dx;
                offset.y += dy;
            }
            
            startX = e.offsetX;
            startY = e.offsetY;
            this.redrawAll();
        });
    }
}