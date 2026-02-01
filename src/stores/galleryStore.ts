import { defineStore } from 'pinia';
import galleryData from '@/core/gallery.json';

// Typy oparte na Twoim JSON
export interface GalleryImage {
  id: string;
  filename: string;
  title: string;
  tags: string[];
  isNew: boolean;
}

export interface GalleryCategory {
  id: string;
  name: string;
  images: GalleryImage[];
}

export const useGalleryStore = defineStore('gallery', {
  state: () => ({
    categories: galleryData as GalleryCategory[],
    selectedCategoryId: 'all', // 'all' lub ID kategorii
    searchQuery: '',
    basePath: '/library/' // Ścieżka do folderu w /public
  }),

  getters: {
    // Spłaszczona lista wszystkich zdjęć (do wyszukiwania globalnego)
    allImages: (state): GalleryImage[] => {
      return state.categories.flatMap(cat => cat.images);
    },

    // Logika filtrowania
    filteredImages: (state): GalleryImage[] => {
      let images: GalleryImage[] = [];

      // 1. Wybór źródła (Konkretna kategoria lub Wszystkie)
      if (state.selectedCategoryId === 'all') {
        images = state.categories.flatMap(cat => cat.images);
      } else {
        const category = state.categories.find(c => c.id === state.selectedCategoryId);
        images = category ? category.images : [];
      }

      // 2. Filtrowanie po wyszukiwarce (Nazwa lub Tagi)
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase();
        images = images.filter(img => 
          img.title.toLowerCase().includes(query) || 
          img.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return images;
    },

    activeCategoryName: (state) => {
        if (state.selectedCategoryId === 'all') return 'Wszystkie zdjęcia';
        return state.categories.find(c => c.id === state.selectedCategoryId)?.name || '';
    }
  },

  actions: {
    setCategory(id: string) {
      this.selectedCategoryId = id;
      // Opcjonalnie czyścimy szukanie przy zmianie kategorii, 
      // ale dla UX lepiej zostawić, jeśli user szuka w konkretnym dziale.
    },
    
    setSearch(query: string) {
      this.searchQuery = query;
      // Jeśli user zaczyna szukać, a jest w pustej kategorii, można przełączyć na 'all'
      // ale na razie zostawmy prosto.
    },

    getImageUrl(filename: string) {
        // Obsługa spacji i znaków specjalnych w URL
        return `${this.basePath}${filename}`;
    }
  }
});