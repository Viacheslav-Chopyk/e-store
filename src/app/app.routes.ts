import { Routes } from '@angular/router';
import {ProductListComponent} from './components/product-list/product-list.component';
import {CartSummaryComponent} from './components/cart-summary/cart-summary.component';
import {LoginComponent} from './components/login/login.component';
import {authGuard, guestGuard} from './guards/auth.guard';
import {ERoutes} from './models/routes';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ERoutes.Products },
  { path: ERoutes.Products, component: ProductListComponent, canActivate: [authGuard] },
  { path: ERoutes.Cart, component: CartSummaryComponent, canActivate: [authGuard] },
  { path: ERoutes.Login, component: LoginComponent, canActivate: [guestGuard] },
  { path: '**', redirectTo: ERoutes.Products }
];
