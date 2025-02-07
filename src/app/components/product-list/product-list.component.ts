import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadProducts, setItemsPerPage, setPage } from '../../store/products/products.actions';
import {
  selectPaginatedProducts,
  selectCurrentPage,
  selectTotalPages,
  selectLoading
} from '../../store/products/products.selectors';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import { ProductCardComponent } from "../product-card/product-card.component";
import { AsyncPipe } from "@angular/common";
import { FiltersComponent } from "../filters/filters.component";
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    ProductCardComponent,
    AsyncPipe,
    FiltersComponent,
    MatPaginator
],
})
export class ProductListComponent implements OnInit {
  paginatedProducts$!: Observable<Product[]>;
  currentPage$!: Observable<number>;
  totalPages$!: Observable<number>;
  loading$!: Observable<boolean>;
  pageSize = 10;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadProducts());
    this.paginatedProducts$ = this.store.select(selectPaginatedProducts);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.loading$ = this.store.select(selectLoading);
  }

  onPageChange(event: PageEvent) {
    if (event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.store.dispatch(setItemsPerPage({ itemsPerPage: event.pageSize }));
    } else {
      this.store.dispatch(setPage({ page: event.pageIndex + 1 }));
    }
  }
}
