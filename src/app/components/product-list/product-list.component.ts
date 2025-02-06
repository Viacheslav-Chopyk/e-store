import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadProducts, setPage } from '../../store/products/products.actions';
import { selectPaginatedProducts, selectCurrentPage, selectTotalPages, selectLoading } from '../../store/products/products.selectors';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import {ProductCardComponent} from "../product-card/product-card.component";
import { AsyncPipe } from "@angular/common";
import {FiltersComponent} from "../filters/filters.component";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [
    ProductCardComponent,
    AsyncPipe,
    FiltersComponent,
    MatButton,
  ],
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  paginatedProducts$!: Observable<Product[]>;
  currentPage$!: Observable<number>;
  totalPages$!: Observable<number>;
  loading$!: Observable<boolean>;
  skeletonArray = Array(6).fill(0);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadProducts());
    this.paginatedProducts$ = this.store.select(selectPaginatedProducts);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.loading$ = this.store.select(selectLoading);
  }

  goToPage(page: number) {
    this.store.dispatch(setPage({ page }));
  }
}
