import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadProducts, setItemsPerPage, setPage } from '../../store/products/products.actions';
import {
  selectProducts,
  selectCurrentPage,
  selectTotal,
  selectLoading,
  selectItemsPerPage
} from '../../store/products/products.selectors';
import { ProductCardComponent } from "../product-card/product-card.component";
import { FiltersComponent } from "../filters/filters.component";
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProductCardComponent,
    FiltersComponent,
    NzPaginationComponent,
    NzSpinComponent
],
})
export class ProductListComponent implements OnInit {
  private store = inject(Store);
  protected authService = inject(AuthService);
  products = this.store.selectSignal(selectProducts);
  currentPage = this.store.selectSignal(selectCurrentPage);
  total = this.store.selectSignal(selectTotal);
  loading = this.store.selectSignal(selectLoading);
  pageSize = this.store.selectSignal(selectItemsPerPage);

  public ngOnInit() {
    this.store.dispatch(loadProducts());
  }

  protected onPageIndexChange(page: number) {
    this.store.dispatch(setPage({ page }));
  }

  protected onPageSizeChange(pageSize: number) {
    this.store.dispatch(setItemsPerPage({ itemsPerPage: pageSize }));
  }
}
