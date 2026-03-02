import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherManagement } from './publisher-management';

describe('PublisherManagement', () => {
  let component: PublisherManagement;
  let fixture: ComponentFixture<PublisherManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublisherManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
