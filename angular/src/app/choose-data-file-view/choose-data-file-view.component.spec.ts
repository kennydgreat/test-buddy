import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDataFileViewComponent } from './choose-data-file-view.component';

describe('ChooseDataFileViewComponent', () => {
  let component: ChooseDataFileViewComponent;
  let fixture: ComponentFixture<ChooseDataFileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseDataFileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseDataFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
