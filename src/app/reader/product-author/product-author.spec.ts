import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAuthor } from './product-author';

describe('ProductAuthor', () => {
  let component: ProductAuthor;
  let fixture: ComponentFixture<ProductAuthor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAuthor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAuthor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
