import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEntryPage } from './user-entry-page';

describe('UserEntryPage', () => {
  let component: UserEntryPage;
  let fixture: ComponentFixture<UserEntryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEntryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEntryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
