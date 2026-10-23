import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartItemCount } from '../../store/cart/cart.selectors';
import { Observable } from 'rxjs';
import {RouterLink} from '@angular/router';
import { AsyncPipe } from '@angular/common';
import {NzHeaderComponent} from 'ng-zorro-antd/layout';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzBadgeComponent} from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    NzHeaderComponent,
    NzButtonComponent,
    NzIconDirective,
    NzBadgeComponent,
    RouterLink,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartItemCount$!: Observable<number>;

  constructor(private store: Store) {
    this.cartItemCount$ = this.store.select(selectCartItemCount);
  }
}
