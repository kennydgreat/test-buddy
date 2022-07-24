import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsConceptOptionBoxComponent } from './ss-concept-option-box.component';

describe('SsConceptOptionBoxComponent', () => {
  let component: SsConceptOptionBoxComponent;
  let fixture: ComponentFixture<SsConceptOptionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsConceptOptionBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsConceptOptionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
