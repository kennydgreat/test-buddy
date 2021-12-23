import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsListItemComponent } from './units-list-item.component';

describe('UnitsListItemComponent', () => {
  let component: UnitsListItemComponent;
  let fixture: ComponentFixture<UnitsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
