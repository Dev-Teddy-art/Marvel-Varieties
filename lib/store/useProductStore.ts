// lib/store/useProductStore.ts
import { create } from 'zustand';
import { getProductsAction } from '@/lib/actions';

interface ProductStore {
  products: any[];
  isLoaded: boolean;
  fetchProducts: (force?: boolean) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoaded: false,
  fetchProducts: async (force = false) => {
    // 0ms instant render if products are already in memory
    if (get().isLoaded && get().products.length > 0 && !force) {
      // Revalidate quietly in the background without blocking the UI
      getProductsAction().then((fresh) => {
        if (fresh && fresh.length > 0) {
          set({ products: fresh });
        }
      }).catch(() => {});
      return;
    }

    try {
      const data = await getProductsAction();
      set({ products: data || [], isLoaded: true });
    } catch (err) {
      console.error('Failed to load products:', err);
      set({ isLoaded: true });
    }
  },
}));