import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageViewComponent } from './error-message-view.component';

describe('ErrorMessageViewComponent', () => {
  let component: ErrorMessageViewComponent;
  let fixture: ComponentFixture<ErrorMessageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorMessageViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
