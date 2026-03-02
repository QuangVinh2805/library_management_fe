import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPublisher } from './product-publisher';

describe('ProductPublisher', () => {
  let component: ProductPublisher;
  let fixture: ComponentFixture<ProductPublisher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPublisher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPublisher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
