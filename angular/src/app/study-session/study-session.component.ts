import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../ngrx-store/app-state';
import { selectCurrentNumberOfConceptsBeingLearnt, selectCurrentNumberOfConceptsLearnt, selectCurrentPercentOfConceptsCompleted } from '../ngrx-store/unit-study-state';
import { UnitSS_Service } from './unitSSService';


@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.scss']
})
export class StudySessionComponent implements OnInit {


  unitSS_Service: UnitSS_Service;
  currentNumberOfConceptsBeingLearnt : Observable<number>;
  currentNumberOfLearntConcepts : Observable<number>;
  currentPercentOfLearntConcepts: Observable<number>;
  constructor(public dialogRef: MatDialogRef<StudySessionComponent>, public store: Store<AppState>) {

    // initiate study session service
    this.unitSS_Service = new UnitSS_Service(store);

    // initiate session progress store observables
    this.currentNumberOfLearntConcepts = this.store.select(selectCurrentNumberOfConceptsLearnt);

    this.currentNumberOfConceptsBeingLearnt = this.store.select(selectCurrentNumberOfConceptsBeingLearnt);

    this.currentPercentOfLearntConcepts = this.store.select(selectCurrentPercentOfConceptsCompleted);
  }

  ngOnInit(): void {
  }

  // user chooses to end the session
  close() {

    //close the dialog, the user's progress should already presisted so it is safe to end the session
    this.dialogRef.close();
  }

  userDoneAnswering() {
    this.unitSS_Service.userAnswered();
  }

  userReadyNextQuestion() {
    this.unitSS_Service.userReadyForNextQuestion();
  }

  ngOnDestroy() {
    this.unitSS_Service.unsubscribeFromAllObservables();
  }

}
