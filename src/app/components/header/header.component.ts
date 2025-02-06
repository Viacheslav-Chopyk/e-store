import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartItemCount } from '../../store/cart/cart.selectors';
import { Observable } from 'rxjs';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import { AsyncPipe } from '@angular/common';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    MatToolbar,
    MatIcon,
    RouterLink,
    AsyncPipe,
    MatIconButton
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartItemCount$!: Observable<number>;

  constructor(private store: Store) {
    this.cartItemCount$ = this.store.select(selectCartItemCount);
  }
}
