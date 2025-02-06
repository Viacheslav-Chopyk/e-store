import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartTotal } from '../../store/cart/cart.selectors';
import { removeFromCart } from '../../store/cart/cart.actions';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cart-item';
import { AsyncPipe } from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  imports: [
    AsyncPipe,
    MatButton
],
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent {
  items$!: Observable<CartItem[]>;
  total$!: Observable<number>;

  constructor(private store: Store) {
    this.items$ = this.store.select(selectCartItems);
    this.total$ = this.store.select(selectCartTotal);
  }

  removeItem(productId: number) {
    this.store.dispatch(removeFromCart({ productId }));
  }

}

