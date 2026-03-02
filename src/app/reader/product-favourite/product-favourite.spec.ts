import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFavourite } from './product-favourite';

describe('ProductFavourite', () => {
  let component: ProductFavourite;
  let fixture: ComponentFixture<ProductFavourite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFavourite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFavourite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
