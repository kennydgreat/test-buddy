import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUnitViewComponent } from './create-unit-view.component';

describe('CreateUnitViewComponent', () => {
  let component: CreateUnitViewComponent;
  let fixture: ComponentFixture<CreateUnitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUnitViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUnitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
