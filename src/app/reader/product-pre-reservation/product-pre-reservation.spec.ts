import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPreReservation } from './product-pre-reservation';

describe('ProductPreReservation', () => {
  let component: ProductPreReservation;
  let fixture: ComponentFixture<ProductPreReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPreReservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPreReservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
