import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordAdmin } from './change-password-admin';

describe('ChangePasswordAdmin', () => {
  let component: ChangePasswordAdmin;
  let fixture: ComponentFixture<ChangePasswordAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
