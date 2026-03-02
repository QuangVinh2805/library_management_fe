import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReservationManagement } from './product-reservation-management';

describe('ProductReservationManagement', () => {
  let component: ProductReservationManagement;
  let fixture: ComponentFixture<ProductReservationManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReservationManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductReservationManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
