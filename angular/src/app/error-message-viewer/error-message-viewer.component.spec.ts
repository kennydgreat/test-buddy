import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageViewerComponent } from './error-message-viewer.component';

describe('ErrorMessageViewerComponent', () => {
  let component: ErrorMessageViewerComponent;
  let fixture: ComponentFixture<ErrorMessageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorMessageViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
