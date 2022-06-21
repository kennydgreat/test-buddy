import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDeleteTimerItemComponent } from './unit-delete-timer-item.component';

describe('UnitDeleteTimerItemComponent', () => {
  let component: UnitDeleteTimerItemComponent;
  let fixture: ComponentFixture<UnitDeleteTimerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitDeleteTimerItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDeleteTimerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
