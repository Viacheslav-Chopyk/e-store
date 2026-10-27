import { Routes } from '@angular/router';
import {ProductListComponent} from './components/product-list/product-list.component';
import {CartSummaryComponent} from './components/cart-summary/cart-summary.component';
import {LoginComponent} from './components/login/login.component';
import {authGuard, guestGuard} from './guards/auth.guard';


export const routes: Routes = [
  { path: '', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartSummaryComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: '**', redirectTo: '' }
];
