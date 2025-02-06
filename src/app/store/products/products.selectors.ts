import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectPaginatedProducts = createSelector(
  selectProductsState,
  (state) => state.paginatedProducts
);

export const selectCurrentPage = createSelector(
  selectProductsState,
  (state) => state.currentPage
);

export const selectTotalPages = createSelector(
  selectProductsState,
  (state) => Math.ceil(state.filteredProducts.length / state.itemsPerPage)
);

export const selectLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);
