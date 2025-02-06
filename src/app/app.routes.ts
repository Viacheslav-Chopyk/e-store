import { Routes } from '@angular/router';
import {ProductListComponent} from './components/product-list/product-list.component';
import {CartSummaryComponent} from './components/cart-summary/cart-summary.component';


export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'cart', component: CartSummaryComponent },
  { path: '**', redirectTo: '' }
];
