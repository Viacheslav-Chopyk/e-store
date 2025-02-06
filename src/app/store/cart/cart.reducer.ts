import { createReducer, on } from '@ngrx/store';
import {addToCart, clearCart, removeFromCart} from './cart.actions';
import { CartItem } from '../../models/cart-item';

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: []
};

export const cartReducer = createReducer(
  initialState,
  on(addToCart, (state, { product }) => {
    const existingItem = state.items.find(item => item.product.id === product.id);
    if (existingItem) {
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    } else {
      return {
        ...state,
        items: [...state.items, { product, quantity: 1 }]
      };
    }
  }),
  on(removeFromCart, (state, { productId }) => ({
    ...state,
    items: state.items.filter(item => item.product.id !== productId)
  }))
);
