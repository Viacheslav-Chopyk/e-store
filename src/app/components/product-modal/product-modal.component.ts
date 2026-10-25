import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
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
  currentImageIndex = signal(0);
  private modalRef = inject<NzModalRef<ProductModalComponent>>(NzModalRef);
  private store = inject(Store);
  private message = inject(NzMessageService);

  protected addToCart() {
    this.store.dispatch(addToCart({ product: this.product }));
    this.modalRef.close();
    this.message.success('Product added to cart!', { nzDuration: 2000 });
  }

  protected close() {
    this.modalRef.close();
  }

  protected nextImage(event: Event) {
    event.stopPropagation();
    const count = this.product.images.length;
    this.currentImageIndex.update(i => (i + 1) % count);
  }

  protected prevImage(event: Event) {
    event.stopPropagation();
    const count = this.product.images.length;
    this.currentImageIndex.update(i => (i - 1 + count) % count);
  }

  protected goToImage(index: number) {
    this.currentImageIndex.set(index);
  }
}
