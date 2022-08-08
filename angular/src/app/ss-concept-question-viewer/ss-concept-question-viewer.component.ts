import { Component, Input, OnInit } from '@angular/core';
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
  userAnwsered: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  chooseOption(option: Option){

    //set the chosen flag for option
    option.chosen = true;

    //mark question
    this.multipleChoiceQuestion.markQuestion();
  }
  


}
