import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptViewerComponent } from './concept-viewer.component';

describe('ConceptViewerComponent', () => {
  let component: ConceptViewerComponent;
  let fixture: ComponentFixture<ConceptViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
