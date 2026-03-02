import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPsychologyCarousel } from './product-psychology-carousel';

describe('ProductPsychologyCarousel', () => {
  let component: ProductPsychologyCarousel;
  let fixture: ComponentFixture<ProductPsychologyCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPsychologyCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPsychologyCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
