import { defineStore } from 'pinia';
import QRCode from 'qrcode';

// --- STAŁE SYGNETU ---
const SYGNET_VIEWBOX_WIDTH = 663;
const SYGNET_VIEWBOX_HEIGHT = 681;
const SYGNET_PATH = "M331.16 0V78.1103H529.282L331.16 276.753L55.1018 0H0V348.191L331.16 680.221L662.32 348.191V0H331.16ZM584.384 315.839L331.16 569.728L77.9057 315.839V133.357L331.13 387.246L584.354 133.357V315.839H584.384Z";

// --- KONFIGURACJA WYMIARÓW (PIXEL PERFECT DLA 1024px) ---
// Tło: 266px, Logo: 200px
const BASE_SIZE = 1024;
const BG_SIZE_RATIO = 266 / BASE_SIZE;   // ~0.26
const LOGO_SIZE_RATIO = 200 / BASE_SIZE; // ~0.195

export interface Theme {
  id: string;
  name: string;
  dark: string;
  light: string;
  previewClass: string;
}

export const THEMES: Theme[] = [
  { 
    id: 'standard', 
    name: 'Standard', 
    dark: '#0F4496', // TEB Blue
    light: '#FFFFFF', 
    previewClass: 'bg-white border-slate-200' 
  },
  { 
    id: 'reverse', 
    name: 'Revers', 
    dark: '#FFFFFF', 
    light: '#0F4496', 
    previewClass: 'bg-teb-blue border-teb-blue text-white' 
  },
];

export const useQrStore = defineStore('qr', {
  state: () => ({
    input: 'teb.pl',
    format: 'png' as 'png' | 'svg',
    showLogo: true,
    activeThemeId: 'standard',
    dataUrl: '',
    isValid: true
  }),

  getters: {
    activeTheme: (state): Theme => {
        const theme = THEMES.find(t => t.id === state.activeThemeId);
        return theme || (THEMES[0] as Theme);
    },
    
    formattedUrl: (state): string => {
      const text = state.input.trim();
      if (!text) return '';
      if (!/^https?:\/\//i.test(text)) return 'https://' + text;
      return text;
    },

    safeHostname: (state): string => {
        try {
            // @ts-ignore
            const urlStr = state.formattedUrl || 'https://teb.pl';
            return new URL(urlStr).hostname;
        } catch {
            return 'qr-code';
        }
    }
  },

  actions: {
    async generate() {
      try {
        const url = new URL(this.formattedUrl);
        this.isValid = url.hostname.includes('.');
      } catch (e) {
        this.isValid = false;
        return;
      }

      if (!this.isValid) return;

      const theme = this.activeTheme;
      
      const options: any = {
        width: BASE_SIZE,
        margin: 1,
        color: { 
          dark: theme.dark, 
          light: theme.light 
        },
        errorCorrectionLevel: this.showLogo ? 'H' : 'M'
      };

      try {
        if (this.format === 'svg') {
          await this.generateSVG(options);
        } else {
          await this.generatePNG(options);
        }
      } catch (err) {
        console.error('QR Gen Error:', err);
      }
    },

    async generatePNG(options: any) {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, this.formattedUrl, options);
        
        if (this.showLogo) {
            await this.drawLogoOnCanvas(canvas);
        }
        this.dataUrl = canvas.toDataURL('image/png');
    },

    async generateSVG(options: any) {
        let svgContent = (await QRCode.toString(this.formattedUrl, { ...options, type: 'svg' })) as unknown as string;
        
        if (this.showLogo) {
            svgContent = this.injectLogoToSVG(svgContent);
        }
        
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        
        if (this.dataUrl.startsWith('blob:')) URL.revokeObjectURL(this.dataUrl);
        this.dataUrl = URL.createObjectURL(blob);
    },

    // --- LOGIKA LOGO (Canvas) ---
    drawLogoOnCanvas(canvas: HTMLCanvasElement): Promise<void> {
        return new Promise(resolve => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve();

            const theme = this.activeTheme;
            const size = canvas.width;

            // PRECYZYJNE WYMIARY
            const bgSize = size * BG_SIZE_RATIO;     // 266px dla 1024px
            const logoSize = size * LOGO_SIZE_RATIO; // 200px dla 1024px
            
            const bgXY = (size - bgSize) / 2;
            const logoXY = (size - logoSize) / 2;

            // Rysujemy tło (Kwadrat bez zaokrągleń)
            ctx.fillStyle = theme.light;
            ctx.fillRect(bgXY, bgXY, bgSize, bgSize);

            // Generujemy SVG sygnetu
            const svgString = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${SYGNET_VIEWBOX_WIDTH}" height="${SYGNET_VIEWBOX_HEIGHT}" viewBox="0 0 ${SYGNET_VIEWBOX_WIDTH} ${SYGNET_VIEWBOX_HEIGHT}">
                    <path d="${SYGNET_PATH}" fill="${theme.dark}"/>
                </svg>
            `;
            
            const img = new Image();
            const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                ctx.drawImage(img, logoXY, logoXY, logoSize, logoSize);
                URL.revokeObjectURL(url);
                resolve();
            };
            img.onerror = () => resolve();
            img.src = url; 
        });
    },

    // --- LOGIKA LOGO (SVG String Manipulation) ---
    injectLogoToSVG(svgString: string): string {
        const viewBoxMatch = svgString.match(/viewBox="0 0 (\d+) (\d+)"/);
        const size = (viewBoxMatch && viewBoxMatch[1]) ? parseInt(viewBoxMatch[1]) : BASE_SIZE;
        
        // PRECYZYJNE WYMIARY
        const bgSize = size * BG_SIZE_RATIO;
        const logoSize = size * LOGO_SIZE_RATIO;
        
        const bgXY = (size - bgSize) / 2;
        const logoXY = (size - logoSize) / 2;
        
        const theme = this.activeTheme;

        // Skalowanie sygnetu
        const scale = logoSize / SYGNET_VIEWBOX_WIDTH;

        const logoGroup = `
            <g>
                <rect x="${bgXY}" y="${bgXY}" width="${bgSize}" height="${bgSize}" fill="${theme.light}"/>
                
                <g transform="translate(${logoXY}, ${logoXY}) scale(${scale})">
                    <path d="${SYGNET_PATH}" fill="${theme.dark}"/>
                </g>
            </g>
        `;
        
        return svgString.replace('</svg>', `${logoGroup}</svg>`);
    },

    download() {
      if (!this.isValid || !this.dataUrl) return;
      
      const link = document.createElement('a');
      link.download = `TEB_QR_${this.safeHostname}_${this.activeTheme.name}.${this.format}`;
      link.href = this.dataUrl;
      link.click();
    }
  }
});