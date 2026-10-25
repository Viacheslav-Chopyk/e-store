import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {ProductService} from '../../services/product.service';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFailure,
  setFilters,
  setPage,
  setItemsPerPage
} from './products.actions';
import {selectProductsState} from './products.selectors';
import {ProductsState} from './products.reducer';
import {IProductQuery} from '../../models/product-query';
import {ALL_TYPES} from '../../components/filters/constans/filter.constants';
import {catchError, map, of, switchMap, withLatestFrom} from 'rxjs';

function toQuery({filters, currentPage, itemsPerPage}: ProductsState): IProductQuery {
  // "Up to $X" checkboxes are OR-ed, so together they mean "price <= the largest checked X".
  const maxPrices = [
    filters.maxPrice,
    filters.priceRanges.length ? Math.max(...filters.priceRanges) : null
  ].filter((price): price is number => price !== null);

  return {
    search: filters.searchText.trim() || undefined,
    type: filters.type === ALL_TYPES ? undefined : filters.type,
    minPrice: filters.minPrice ?? undefined,
    maxPrice: maxPrices.length ? Math.min(...maxPrices) : undefined,
    page: currentPage,
    limit: itemsPerPage
  };
}

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private productService = inject(ProductService)

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts, setFilters, setPage, setItemsPerPage),
      withLatestFrom(this.store.select(selectProductsState)),
      // switchMap drops stale responses, e.g. while the user is still typing in search
      switchMap(([, state]) =>
        this.productService.getProducts(toQuery(state)).pipe(
          map(({items, total}) => loadProductsSuccess({products: items, total})),
          catchError((error) => of(loadProductsFailure({error: error.message})))
        )
      )
    )
  );
}
