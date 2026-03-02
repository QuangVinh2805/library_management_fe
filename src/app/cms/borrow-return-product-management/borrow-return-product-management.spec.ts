import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowReturnProductManagement } from './borrow-return-product-management';

describe('BorrowReturnProductManagement', () => {
  let component: BorrowReturnProductManagement;
  let fixture: ComponentFixture<BorrowReturnProductManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowReturnProductManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowReturnProductManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
