import { Component, Input, OnInit } from '@angular/core';
import { OptionState } from '../ngrx-store/models/study-session/multiple-choice-option';

@Component({
  selector: 'app-ss-concept-option-box',
  templateUrl: './ss-concept-option-box.component.html',
  styleUrls: ['./ss-concept-option-box.component.scss']
})
export class SsConceptOptionBoxComponent implements OnInit {

  // the component's states
  @Input() state: OptionState;

  @Input() text: string;

  @Input() index: number;

  constructor() { }

  ngOnInit(): void {
  }

}
