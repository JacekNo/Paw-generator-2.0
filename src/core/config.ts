// src/core/config.ts

export interface FormatConfig {
    id: string;
    name: string;
    w: number;
    h: number;
    hasText: boolean;
    photoHeight?: number; // ? oznacza, że pole jest opcjonalne
    overlay?: string;
    fontSize?: number;
    lineHeight?: number;
    maxLines?: number;
    textX?: number;
    textY?: number;
    maxWidth?: number;
    textColor?: string;
}

export const SZKOLENIA_CONFIG: FormatConfig[] = [

    // Konfiguracja dla modułu TEB SZKOLENIA

    {
        id: 'POST',
        name: 'Post (768x960)',
        w: 768, h: 960,
        hasText: true,
        photoHeight: 480,
        overlay: 'assets/overlays/Szkolenia_768x960.png', // Upewnij się co do ścieżki!
        fontSize: 36, lineHeight: 1.2, maxLines: 3, 
        textX: 25, textY: 530, maxWidth: 668,
        textColor: '#1D1D1B'
    },
    {
        id: 'KWADRAT',
        name: 'Kwadrat (1080x1080)',
        w: 1080, h: 1080,
        hasText: true,
        photoHeight: 629,
        overlay: 'assets/overlays/Szkolenia_1080x1080.png',
        fontSize: 48, lineHeight: 1.2, maxLines: 3, 
        textX: 35, textY: 670, maxWidth: 960,
        textColor: '#1D1D1B'
    },
    {
        id: 'STORY',
        name: 'Story (1080x1920)',
        w: 1080, h: 1920,
        hasText: true,
        photoHeight: 917,
        overlay: 'assets/overlays/Szkolenia_1080x1920.png',
        fontSize: 48, lineHeight: 1.2, maxLines: 3, 
        textX: 35, textY: 975, maxWidth: 920,
        textColor: '#1D1D1B'
    },
    {
        id: 'WWW',
        name: 'NST (1080x720)',
        w: 1080, h: 720,
        hasText: false,
        photoHeight: 720,
        overlay: 'assets/overlays/NST_1080x720.png',
        textColor: '#1D1D1B'
    },
    {
        id: 'WYDARZENIE',
        name: 'Wydarzenie FB (1200x628)',
        w: 1200, h: 628,
        hasText: false,
        photoHeight: 628,
        overlay: 'assets/overlays/Szkolenia_1200x628.png',
        textColor: '#1D1D1B'
    }
];
    
