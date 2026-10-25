import {Component, Input, ChangeDetectionStrategy, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {IProduct} from '../../models/product';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ProductModalComponent} from '../product-modal/product-modal.component';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzPopconfirmDirective} from 'ng-zorro-antd/popconfirm';
import {AuthService} from '../../services/auth.service';
import {deleteProduct} from '../../store/products/products.actions';

@Component({
  selector: 'app-product-card',
  imports: [
    NzCardComponent,
    NzIconDirective,
    NzButtonComponent,
    NzPopconfirmDirective
  ],
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: IProduct;
  currentImageIndex: number = 0;
  protected authService = inject(AuthService);
  private store = inject(Store);

  constructor(private modal: NzModalService) {}

  prevImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
  }

  nextImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
  }

  protected openProductModal() {
    this.modal.create({
      nzTitle: this.product.name,
      nzContent: ProductModalComponent,
      nzData: this.product,
      nzWidth: 600
    });
  }

  protected deleteItem() {
    this.store.dispatch(deleteProduct({id: this.product.id}));
  }
}
