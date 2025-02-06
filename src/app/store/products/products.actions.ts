import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/product';
import {FilterOptions} from '../../models/filter-options';

export const loadProducts = createAction('[Products] Load Products');

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const setFilters = createAction(
  '[Products] Set Filters',
  props<{ filters: FilterOptions }>()
);

export const setPage = createAction(
  '[Products] Set Page',
  props<{ page: number }>()
);

export const setItemsPerPage = createAction(
  '[Products] Set Items Per Page',
  props<{ itemsPerPage: number }>()
);
