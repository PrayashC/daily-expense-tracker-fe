import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameLogo } from './name-logo';

describe('NameLogo', () => {
  let component: NameLogo;
  let fixture: ComponentFixture<NameLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameLogo],
    }).compileComponents();

    fixture = TestBed.createComponent(NameLogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
