import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { NzModalService } from 'ng-zorro-antd/modal';

import { ProductCardComponent } from './product-card.component';
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

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideHttpClient(), provideMockStore(), NzModalService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    // `product` is input.required() — it must be set before the first render.
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
