import { createFeatureSelector, createSelector} from '@ngrx/store';
import { ProductsState } from './products.reducer';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectProducts = createSelector(
  selectProductsState,
  (state) => state.products
);

export const selectCurrentPage = createSelector(
  selectProductsState,
  (state) => state.currentPage
);


export const selectLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);


export const selectTotal = createSelector(
  selectProductsState,
  (state) => state.total
);
