import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordCms } from './reset-password-cms';

describe('ResetPasswordCms', () => {
  let component: ResetPasswordCms;
  let fixture: ComponentFixture<ResetPasswordCms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordCms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordCms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
