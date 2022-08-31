import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
  @Output() userReadyForNextQuestion = new EventEmitter<void>();
  userAnwsered: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  chooseOption(option: Option) {

    if (this.multipleChoiceQuestion.type === 'multi-answer') {
      //set the chosen flag for option
      option.toggleChosen();
    } else {
      option.chosen = true;
      // if the question does not have multiple then the user has answered
      this.done();
    }



  }

  optionsDragDropEvent(event: CdkDragDrop<Option[]>) {
    // change the order of the element according to user action
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    //update options
    this.multipleChoiceQuestion.options = event.container.data;

  }


  ok() {
    this.userReadyForNextQuestion.emit();
  }

  done() {
    // user is done responding, mark question tell parent user done answering
    this.userDoneAnswering.emit();
  }

  readyForUserInput(){
    return (this.multipleChoiceQuestion.type === "ordered question" || this.multipleChoiceQuestion.type === "multi-answer") && !this.multipleChoiceQuestion.marked;
  }


}
