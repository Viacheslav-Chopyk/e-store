import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {IProduct} from '../../models/product';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ProductModalComponent} from '../product-modal/product-modal.component';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzButtonComponent} from 'ng-zorro-antd/button';

@Component({
  selector: 'app-product-card',
  imports: [
    NzCardComponent,
    NzIconDirective,
    NzButtonComponent
  ],
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: IProduct;
  currentImageIndex: number = 0;

  constructor(private modal: NzModalService) {}

  prevImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
  }

  nextImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
  }

  openProductModal() {
    this.modal.create({
      nzTitle: this.product.name,
      nzContent: ProductModalComponent,
      nzData: this.product,
      nzWidth: 600
    });
  }
}
