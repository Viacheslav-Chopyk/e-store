import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ProductService} from '../../services/product.service';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFailure,
  setFilters,
  setPage,
  setItemsPerPage,
  deleteProduct,
  deleteProductSuccess,
  deleteProductFailure
} from './products.actions';
import {selectProductsState} from './products.selectors';
import {ProductsState} from './products.reducer';
import {IProductQuery} from '../../models/product-query';
import {ALL_TYPES} from '../../components/filters/constans/filter.constants';
import {catchError, map, mergeMap, of, switchMap, tap, withLatestFrom} from 'rxjs';

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
  private message = inject(NzMessageService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      // deleteProductSuccess: reload the current page so the gap is filled and `total` stays correct
      ofType(loadProducts, setFilters, setPage, setItemsPerPage, deleteProductSuccess),
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

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProduct),
      // mergeMap, not switchMap: deleting two products quickly must not cancel the first request
      mergeMap(({id}) =>
        this.productService.deleteProduct(id).pipe(
          map(() => deleteProductSuccess({id})),
          catchError((error) => of(deleteProductFailure({error: error.error?.message ?? error.message})))
        )
      )
    )
  );

  deleteProductResult$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteProductSuccess, deleteProductFailure),
        tap((action) =>
          action.type === deleteProductSuccess.type
            ? this.message.success('Product deleted')
            : this.message.error(`Could not delete product: ${action.error}`)
        )
      ),
    {dispatch: false}
  );
}
