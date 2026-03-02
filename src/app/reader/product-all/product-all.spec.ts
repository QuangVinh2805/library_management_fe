import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAll } from './product-all';

describe('ProductAll', () => {
  let component: ProductAll;
  let fixture: ComponentFixture<ProductAll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
