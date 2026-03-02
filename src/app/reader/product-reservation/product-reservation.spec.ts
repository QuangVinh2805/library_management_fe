import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReservation } from './product-reservation';

describe('ProductReservation', () => {
  let component: ProductReservation;
  let fixture: ComponentFixture<ProductReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductReservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
