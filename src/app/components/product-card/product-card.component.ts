import {Component, Input} from '@angular/core';
import {Product} from '../../models/product';
import {MatCard, MatCardContent, MatCardImage, MatCardTitle} from '@angular/material/card';
import {MatDialog} from '@angular/material/dialog';
import {ProductModalComponent} from '../product-modal/product-modal.component';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-product-card',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardImage,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  currentImageIndex: number = 0;

  constructor(private dialog: MatDialog) {}

  prevImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
  }

  nextImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
  }

  openProductModal() {
    this.dialog.open(ProductModalComponent, {
      data: this.product
    });
  }
}
