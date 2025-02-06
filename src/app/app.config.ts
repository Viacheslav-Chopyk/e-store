import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import {provideHttpClient} from '@angular/common/http';
import {productsReducer} from './store/products/products.reducer';
import {provideEffects} from '@ngrx/effects';
import {ProductsEffects} from './store/products/products.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({ products: productsReducer }),
    provideEffects([ProductsEffects]),
  ]
};
