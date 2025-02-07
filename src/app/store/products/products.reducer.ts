import { createReducer, on } from '@ngrx/store';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFailure,
  setFilters,
  setPage,
} from './products.actions';
import { Product } from '../../models/product';
import { FilterOptions } from '../../models/filter-options';

export interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  paginatedProducts: Product[];
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  paginatedProducts: [],
  currentPage: 1,
  itemsPerPage: 10,
  loading: false,
  error: null,
  filters: {
    searchText: '',
    type: 'All',
    priceRanges: [],
    maxPrice: null,
    minPrice: null,
  }
};

function paginateProducts(products: Product[], page: number, itemsPerPage: number): Product[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return products.slice(startIndex, endIndex);
}

export const productsReducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({ ...state, loading: true })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    loading: false,
    products,
    filteredProducts: products,
    paginatedProducts: paginateProducts(products, 1, state.itemsPerPage),
    currentPage: 1
  })),
  on(loadProductsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(setFilters, (state, { filters }) => {
    const filteredProducts = state.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(filters.searchText.toLowerCase());
      const matchesType = filters.type === 'All' || product.type === filters.type;
      const matchesPrice = filters.priceRanges.length
        ? filters.priceRanges.some(range => product.price <= range)
        : true;

      const matchesMinPrice = filters.minPrice !== null ? product.price >= filters.minPrice : true;
      const matchesMaxPrice = filters.maxPrice !== null ? product.price <= filters.maxPrice : true;

      return matchesSearch && matchesType && matchesPrice && matchesMinPrice && matchesMaxPrice;
    });

    return {
      ...state,
      filters,
      filteredProducts,
      paginatedProducts: paginateProducts(filteredProducts, 1, state.itemsPerPage),
      currentPage: 1
    };
  }),

  on(setPage, (state, { page }) => ({
    ...state,
    currentPage: page,
    paginatedProducts: paginateProducts(state.filteredProducts, page, state.itemsPerPage)
  }))
);
