import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadProducts, setItemsPerPage, setPage } from '../../store/products/products.actions';
import {
  selectPaginatedProducts,
  selectCurrentPage,
  selectTotalPages,
  selectLoading
} from '../../store/products/products.selectors';
import { Observable } from 'rxjs';
import { IProduct } from '../../models/product';
import { ProductCardComponent } from "../product-card/product-card.component";
import { AsyncPipe } from "@angular/common";
import { FiltersComponent } from "../filters/filters.component";
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzSpinComponent } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProductCardComponent,
    AsyncPipe,
    FiltersComponent,
    NzPaginationComponent,
    NzSpinComponent
],
})
export class ProductListComponent implements OnInit {
  paginatedProducts$!: Observable<IProduct[]>;
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

  onPageIndexChange(page: number) {
    this.store.dispatch(setPage({ page }));
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.store.dispatch(setItemsPerPage({ itemsPerPage: pageSize }));
  }
}
