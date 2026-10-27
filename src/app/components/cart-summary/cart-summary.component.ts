import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartTotal } from '../../store/cart/cart.selectors';
import { removeFromCart } from '../../store/cart/cart.actions';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {RouterLink} from '@angular/router';
import {ERoutes} from '../../models/routes';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  imports: [
    NzButtonComponent,
    NzIconDirective,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent {
  private store = inject(Store);
  readonly ERoutes = ERoutes;
  items = this.store.selectSignal(selectCartItems);
  total = this.store.selectSignal(selectCartTotal);

  removeItem(productId: number) {
    this.store.dispatch(removeFromCart({ productId }));
  }

}
