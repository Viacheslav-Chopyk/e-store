import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { ProductModalComponent } from './product-modal.component';
import { IProduct } from '../../models/product';

const product: IProduct = {
  id: 1,
  name: 'Test TV',
  type: 'TVs',
  price: 500,
  rating: 4,
  description: '',
  images: ['a.jpg', 'b.jpg'],
  reviews: []
};

describe('ProductModalComponent', () => {
  let component: ProductModalComponent;
  let fixture: ComponentFixture<ProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductModalComponent],
      // Normally NzModalService provides these when it opens the modal.
      providers: [
        provideMockStore(),
        { provide: NZ_MODAL_DATA, useValue: product },
        { provide: NzModalRef, useValue: { close: vi.fn(), updateConfig: vi.fn() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
