import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitViewerComponent } from './unit-viewer.component';

describe('CreateUnitComponent', () => {
  let component: UnitViewerComponent;
  let fixture: ComponentFixture<UnitViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
