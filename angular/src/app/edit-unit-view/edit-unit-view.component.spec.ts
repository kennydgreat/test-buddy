import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitViewComponent } from './edit-unit-view.component';

describe('EditUnitViewComponent', () => {
  let component: EditUnitViewComponent;
  let fixture: ComponentFixture<EditUnitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUnitViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
