import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsConceptProgressDotComponent } from './ss-concept-progress-dot.component';

describe('SsConceptProgressDotComponent', () => {
  let component: SsConceptProgressDotComponent;
  let fixture: ComponentFixture<SsConceptProgressDotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsConceptProgressDotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsConceptProgressDotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
