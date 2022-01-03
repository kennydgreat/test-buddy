import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardChangesDialogComponent } from './discard-changes-dialog.component';

describe('DiscardChangesDialogComponent', () => {
  let component: DiscardChangesDialogComponent;
  let fixture: ComponentFixture<DiscardChangesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscardChangesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscardChangesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
