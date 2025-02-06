import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Product } from '../../models/product';
import { addToCart } from '../../store/cart/cart.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    MatDialogClose
  ],
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public product: Product,
    private dialogRef: MatDialogRef<ProductModalComponent>,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}

  addToCart() {
    this.store.dispatch(addToCart({ product: this.product }));
    this.dialogRef.close();
    this.snackBar.open('Product added to cart!', 'Close', { duration: 2000 });
  }
}
