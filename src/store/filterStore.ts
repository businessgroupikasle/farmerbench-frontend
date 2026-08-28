import { create } from 'zustand';
import { ProductQueryInput } from '@formerbench/shared';

interface FilterState {
  filters: ProductQueryInput;
  setSearch: (search: string) => void;
  setCategory: (category: string | undefined) => void;
  setPriceRange: (minPrice?: number, maxPrice?: number) => void;
  setMinRating: (minRating?: number) => void;
  setSortBy: (sortBy: ProductQueryInput['sortBy']) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const defaultFilters: ProductQueryInput = {
  page: 1,
  limit: 12,
  search: '',
  category: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  sortBy: 'newest',
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,

  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search: search || undefined, page: 1 },
    })),

  setCategory: (category) =>
    set((state) => ({
      filters: { ...state.filters, category: category || undefined, page: 1 },
    })),

  setPriceRange: (minPrice, maxPrice) =>
    set((state) => ({
      filters: { ...state.filters, minPrice, maxPrice, page: 1 },
    })),

  setMinRating: (minRating) =>
    set((state) => ({
      filters: { ...state.filters, minRating, page: 1 },
    })),

  setSortBy: (sortBy) =>
    set((state) => ({
      filters: { ...state.filters, sortBy, page: 1 },
    })),

  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),

  resetFilters: () =>
    set({
      filters: defaultFilters,
    }),
}));
