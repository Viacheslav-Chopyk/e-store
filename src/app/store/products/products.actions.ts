import { createAction, props } from '@ngrx/store';
import { IProduct } from '../../models/product';
import {IFilterOptions} from '../../models/filter-options';

export const loadProducts = createAction('[Products] Load Products');

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: IProduct[]; total: number }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const setFilters = createAction(
  '[Products] Set Filters',
  props<{ filters: IFilterOptions }>()
);

export const setPage = createAction(
  '[Products] Set Page',
  props<{ page: number }>()
);

export const setItemsPerPage = createAction(
  '[Products] Set Items Per Page',
  props<{ itemsPerPage: number }>()
);

export const deleteProduct = createAction(
  '[Products] Delete Product',
  props<{ id: number }>()
);

export const deleteProductSuccess = createAction(
  '[Products] Delete Product Success',
  props<{ id: number }>()
);

export const deleteProductFailure = createAction(
  '[Products] Delete Product Failure',
  props<{ error: string }>()
);
