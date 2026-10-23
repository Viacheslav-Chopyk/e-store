import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartTotal } from '../../store/cart/cart.selectors';
import { removeFromCart } from '../../store/cart/cart.actions';
import { Observable } from 'rxjs';
import { ICartItem } from '../../models/cart-item';
import {AsyncPipe} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  imports: [
    AsyncPipe,
    NzButtonComponent,
    NzIconDirective,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent {
  items$!: Observable<ICartItem[]>;
  total$!: Observable<number>;

  constructor(private store: Store) {
    this.items$ = this.store.select(selectCartItems);
    this.total$ = this.store.select(selectCartTotal);
  }

  removeItem(productId: number) {
    this.store.dispatch(removeFromCart({ productId }));
  }

}

