import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '../ngrx-store/app-state';
import { UnitSS_Service } from './unitSSService';


@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.scss']
})
export class StudySessionComponent implements OnInit {


  unitSS_Service: UnitSS_Service;
  constructor(public dialogRef: MatDialogRef<StudySessionComponent>, public store: Store<AppState>) {

    this.unitSS_Service = new UnitSS_Service(store);

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
