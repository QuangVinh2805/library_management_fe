import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryCarousel } from './product-category-carousel';

describe('ProductCategoryCarousel', () => {
  let component: ProductCategoryCarousel;
  let fixture: ComponentFixture<ProductCategoryCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
