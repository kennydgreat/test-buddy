import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsConceptQuestionViewerComponent } from './ss-concept-question-viewer.component';

describe('SsConceptQuestionViewerComponent', () => {
  let component: SsConceptQuestionViewerComponent;
  let fixture: ComponentFixture<SsConceptQuestionViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsConceptQuestionViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsConceptQuestionViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
