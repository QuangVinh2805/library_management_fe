import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerManagement } from './banner-management';

describe('BannerManagement', () => {
  let component: BannerManagement;
  let fixture: ComponentFixture<BannerManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
