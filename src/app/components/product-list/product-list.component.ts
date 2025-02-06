import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadProducts } from '../../store/products/products.actions';
import { selectAllProducts, selectLoading } from '../../store/products/products.selectors';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import {ProductCardComponent} from '../product-card/product-card.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [
    ProductCardComponent,
    AsyncPipe
],
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit() {
    this.store.dispatch(loadProducts());
  }
}
