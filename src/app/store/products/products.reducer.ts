import { createReducer, on } from '@ngrx/store';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFailure,
  setFilters,
  setPage,
  setItemsPerPage,
} from './products.actions';
import { IProduct } from '../../models/product';
import { IFilterOptions } from '../../models/filter-options';

export interface ProductsState {
  // Only the current page — filtering and pagination happen on the server.
  products: IProduct[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
  filters: IFilterOptions;
}

const initialState: ProductsState = {
  products: [],
  total: 0,
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

export const productsReducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({ ...state, loading: true, error: null })),
  on(loadProductsSuccess, (state, { products, total }) => ({
    ...state,
    loading: false,
    products,
    total
  })),
  on(loadProductsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(setFilters, (state, { filters }) => ({
    ...state,
    filters,
    currentPage: 1,
    loading: true,
    error: null
  })),

  on(setPage, (state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),

  on(setItemsPerPage, (state, { itemsPerPage }) => ({
    ...state,
    itemsPerPage,
    currentPage: 1,
    loading: true,
    error: null
  }))
);
