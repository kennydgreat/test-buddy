import { Component, Input, OnInit } from '@angular/core';
import { LearningProgressStates } from '../ngrx-store/unit-study-state';

@Component({
  selector: 'app-ss-concept-progress-dot',
  templateUrl: './ss-concept-progress-dot.component.html',
  styleUrls: ['./ss-concept-progress-dot.component.scss']
})
export class SsConceptProgressDotComponent implements OnInit {

  // the status of the 
  @Input() status: LearningProgressStates;
  constructor() { }

  ngOnInit(): void {
  }

}
