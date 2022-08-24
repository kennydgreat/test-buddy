import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option, OptionState } from '../ngrx-store/models/study-session/multiple-choice-option';
import { MultipleChoiceQuestion } from '../ngrx-store/models/study-session/multiple-choice-question';

@Component({
  selector: 'app-ss-concept-question-viewer',
  templateUrl: './ss-concept-question-viewer.component.html',
  styleUrls: ['./ss-concept-question-viewer.component.scss']
})
export class SsConceptQuestionViewerComponent implements OnInit {

  @Input() conceptName: string;
  @Input() multipleChoiceQuestion: MultipleChoiceQuestion
  @Output() userDoneAnswering = new EventEmitter<void>();
  userAnwsered: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  chooseOption(option: Option) {

    if (this.multipleChoiceQuestion.hasMultipleAnwsers) {
      //set the chosen flag for option
      option.toggleChosen();
    } else {
      option.chosen = true;
      // if the question does not have multiple then the user has answered
      this.done();
    }



  }

  done() {
    // user is done responding, mark question tell parent user done answering
    this.userDoneAnswering.emit();
  }



}
