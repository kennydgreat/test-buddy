import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestbuddyHelperComponent } from './testbuddy-helper.component';

describe('TestbuddyHelperComponent', () => {
  let component: TestbuddyHelperComponent;
  let fixture: ComponentFixture<TestbuddyHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestbuddyHelperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestbuddyHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
