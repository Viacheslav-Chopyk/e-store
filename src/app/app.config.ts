import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {ActionReducer, provideStore} from '@ngrx/store';
import {provideHttpClient} from '@angular/common/http';
import {productsReducer, ProductsState} from './store/products/products.reducer';
import {provideEffects} from '@ngrx/effects';
import {ProductsEffects} from './store/products/products.effects';
import {cartReducer, CartState} from './store/cart/cart.reducer';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    const nextState = reducer(state, action);
    if (nextState.cart) {
      localStorage.setItem('cart', JSON.stringify(nextState.cart));
    }
    return nextState;
  };
}

export const getInitialState = (): { cart?: CartState; products?: ProductsState } => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? { cart: JSON.parse(cart) } : {};
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return {};
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(
      { products: productsReducer, cart: cartReducer },
      { metaReducers: [localStorageSyncReducer], initialState: getInitialState() }
    ),
    provideEffects([ProductsEffects]),
  ]
};
