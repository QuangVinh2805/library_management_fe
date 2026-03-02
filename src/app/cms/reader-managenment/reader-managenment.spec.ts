import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderManagenment } from './reader-managenment';

describe('ReaderManagenment', () => {
  let component: ReaderManagenment;
  let fixture: ComponentFixture<ReaderManagenment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderManagenment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReaderManagenment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
