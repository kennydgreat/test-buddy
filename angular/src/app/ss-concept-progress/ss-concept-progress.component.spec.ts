import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsConceptProgressComponent } from './ss-concept-progress.component';

describe('SsConceptProgressComponent', () => {
  let component: SsConceptProgressComponent;
  let fixture: ComponentFixture<SsConceptProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsConceptProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsConceptProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
