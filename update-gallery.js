import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- KONFIGURACJA ---
const LIBRARY_DIR = 'public/library';
const OUTPUT_FILE = 'src/core/gallery.json';

// Helpery do ścieżek w module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funkcja robiąca ładne ID (np. "Art & Design" -> "art-design")
const slugify = (text) => text.toString().toLowerCase()
  .replace(/\s+/g, '-')           // Zamień spacje na -
  .replace(/[^\w\-]+/g, '')       // Usuń non-word chars
  .replace(/\-\-+/g, '-')         // Zamień wiele - na jeden
  .replace(/^-+/, '')             // Usuń - z początku
  .replace(/-+$/, '');            // Usuń - z końca

function generateGallery() {
    const libraryPath = path.join(__dirname, LIBRARY_DIR);
    const outputPath = path.join(__dirname, OUTPUT_FILE);

    if (!fs.existsSync(libraryPath)) {
        console.error(`❌ Błąd: Folder ${LIBRARY_DIR} nie istnieje!`);
        return;
    }

    const categories = [];
    const folders = fs.readdirSync(libraryPath, { withFileTypes: true });

    folders.forEach(dirent => {
        if (!dirent.isDirectory()) return;

        const catName = dirent.name;
        const catId = slugify(catName);
        const catPath = path.join(libraryPath, catName);
        
        const files = fs.readdirSync(catPath).filter(file => {
            return ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase());
        });

        const images = files.map((file, index) => {
            const fileNameWithoutExt = path.parse(file).name;
            
            // Logika automatyczna:
            // Tytuł = nazwa pliku (usuwamy rozszerzenie)
            // ID = kategoria + index
            // isNew = opcjonalnie: można sprawdzić datę utworzenia pliku (tu uproszczone do false)
            
            return {
                id: `${catId}_${index + 1}`.replace(/-/g, '_'),
                filename: `${catName}/${file}`, // Ścieżka relatywna dla galleryStore
                title: fileNameWithoutExt,
                tags: [], // Tu można dodać logikę tagów w przyszłości
                isNew: false 
            };
        });

        if (images.length > 0) {
            categories.push({
                id: catId,
                name: catName, // Używamy oryginalnej nazwy folderu jako Labela
                images: images
            });
        }
    });

    const jsonContent = JSON.stringify(categories, null, 4); // Ładne formatowanie
    fs.writeFileSync(outputPath, jsonContent);

    console.log(`✅ Sukces! Wygenerowano ${categories.length} kategorii i ${categories.reduce((acc, c) => acc + c.images.length, 0)} zdjęć.`);
    console.log(`📂 Zapisano w: ${OUTPUT_FILE}`);
}

generateGallery();