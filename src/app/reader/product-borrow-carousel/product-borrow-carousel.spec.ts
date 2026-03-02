import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBorrowCarousel } from './product-borrow-carousel';

describe('ProductBorrowCarousel', () => {
  let component: ProductBorrowCarousel;
  let fixture: ComponentFixture<ProductBorrowCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductBorrowCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductBorrowCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
