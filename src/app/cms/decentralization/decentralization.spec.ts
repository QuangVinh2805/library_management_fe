import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Decentralization } from './decentralization';

describe('Decentralization', () => {
  let component: Decentralization;
  let fixture: ComponentFixture<Decentralization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Decentralization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Decentralization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
