import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteManagement } from './route-management';

describe('RouteManagement', () => {
  let component: RouteManagement;
  let fixture: ComponentFixture<RouteManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
