import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  ArrowLeftOutline, DeleteOutline, LeftOutline, LogoutOutline, RightOutline, SearchOutline, ShoppingCartOutline,
  UserOutline
} from '@ant-design/icons-angular/icons';
import {ActionReducer, provideStore} from '@ngrx/store';
import {provideHttpClient, withInterceptors, withXhr} from '@angular/common/http';
import {authInterceptor} from './interceptors/auth.interceptor';
import {AuthService} from './services/auth.service';
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
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    provideAppInitializer(() => inject(AuthService).restoreSession()),
    provideRouter(routes),
    provideNzI18n(en_US),
    NzModalService,
    provideNzIcons([
      ArrowLeftOutline, DeleteOutline, LeftOutline, LogoutOutline, RightOutline, SearchOutline, ShoppingCartOutline,
      UserOutline
    ]),
    provideStore(
      { products: productsReducer, cart: cartReducer },
      { metaReducers: [localStorageSyncReducer], initialState: getInitialState() }
    ),
    provideEffects([ProductsEffects]),
  ]
};
