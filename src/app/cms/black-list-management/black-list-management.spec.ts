import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackListManagement } from './black-list-management';

describe('BlackListManagement', () => {
  let component: BlackListManagement;
  let fixture: ComponentFixture<BlackListManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlackListManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackListManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
