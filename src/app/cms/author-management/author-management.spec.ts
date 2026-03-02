import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorManagement } from './author-management';

describe('AuthorManagement', () => {
  let component: AuthorManagement;
  let fixture: ComponentFixture<AuthorManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
