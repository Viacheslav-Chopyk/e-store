import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/product';

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ product: Product }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ productId: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');
