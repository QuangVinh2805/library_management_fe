import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFavouriteCarousel } from './product-favourite-carousel';

describe('ProductFavouriteCarousel', () => {
  let component: ProductFavouriteCarousel;
  let fixture: ComponentFixture<ProductFavouriteCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFavouriteCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFavouriteCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
