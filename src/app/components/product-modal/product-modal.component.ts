import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalFooterDirective, NzModalRef } from 'ng-zorro-antd/modal';
import { Store } from '@ngrx/store';
import { IProduct } from '../../models/product';
import { addToCart } from '../../store/cart/cart.actions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  imports: [
    NzModalFooterDirective,
    NzButtonComponent,
    NzIconDirective
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent {
  readonly product: IProduct = inject(NZ_MODAL_DATA);
  currentImageIndex: number = 0;

  constructor(
    private modalRef: NzModalRef<ProductModalComponent>,
    private store: Store,
    private message: NzMessageService
  ) {}

  protected addToCart() {
    this.store.dispatch(addToCart({ product: this.product }));
    this.modalRef.close();
    this.message.success('Product added to cart!', { nzDuration: 2000 });
  }

  private close() {
    this.modalRef.close();
  }

  protected nextImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.product.images.length;
  }

  protected prevImage(event: Event) {
    event.stopPropagation();
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.product.images.length) %
      this.product.images.length;
  }

  protected goToImage(index: number) {
    this.currentImageIndex = index;
  }
}
