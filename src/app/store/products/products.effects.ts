import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {ProductService} from '../../services/product.service';
import {loadProducts, loadProductsSuccess, loadProductsFailure} from './products.actions';
import {catchError, map, mergeMap, of} from 'rxjs';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService)

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      mergeMap(() =>
        this.productService.getProducts().pipe(
          map((products) => loadProductsSuccess({products})),
          catchError((error) => of(loadProductsFailure({error: error.message})))
        )
      )
    )
  );
}
