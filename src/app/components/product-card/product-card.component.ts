import {Component, Input} from '@angular/core';
import {Product} from '../../models/product';
import {MatCard, MatCardContent, MatCardImage, MatCardTitle} from '@angular/material/card';
import {MatDialog} from '@angular/material/dialog';
import {ProductModalComponent} from '../product-modal/product-modal.component';

@Component({
  selector: 'app-product-card',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardImage
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private dialog: MatDialog) {}

  openProductModal() {
    this.dialog.open(ProductModalComponent, {
      data: this.product
    });
  }
}
