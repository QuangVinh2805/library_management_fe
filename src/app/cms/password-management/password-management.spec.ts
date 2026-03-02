import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordManagement } from './password-management';

describe('PasswordManagement', () => {
  let component: PasswordManagement;
  let fixture: ComponentFixture<PasswordManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
