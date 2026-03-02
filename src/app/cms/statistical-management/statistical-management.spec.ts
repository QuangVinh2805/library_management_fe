import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalManagement } from './statistical-management';

describe('StatisticalManagement', () => {
  let component: StatisticalManagement;
  let fixture: ComponentFixture<StatisticalManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
