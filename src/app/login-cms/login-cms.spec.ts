import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCms } from './login-cms';

describe('LoginCms', () => {
  let component: LoginCms;
  let fixture: ComponentFixture<LoginCms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
