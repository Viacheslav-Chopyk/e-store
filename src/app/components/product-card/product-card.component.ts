import {Component, Input} from '@angular/core';
import {Product} from '../../models/product';
import {MatCard, MatCardContent, MatCardImage, MatCardTitle} from '@angular/material/card';

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
}
