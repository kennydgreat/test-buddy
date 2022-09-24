import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '../ngrx-store/app-state';
import { UnitSS_Stateful } from '../ngrx-store/models/study-session/unitSSService';
import { studyUnit } from '../ngrx-store/reducers/unit-study-session.reducer';

@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.scss']
})
export class StudySessionComponent implements OnInit {


  unitSS_Stateful: UnitSS_Stateful;
  constructor(public dialogRef: MatDialogRef<StudySessionComponent>, public store: Store<AppState>) {

    this.unitSS_Stateful = new UnitSS_Stateful(store);

  }

  ngOnInit(): void {
  }

  // user chooses to end the session
  close() {
    // clear study unit inn state
    //this.store.dispatch(studyUnit(""));
    //close the dialog, the user's progress should already presisted so it is safe to end the session
    this.dialogRef.close();
  }

  userDoneAnswering() {
    this.unitSS_Stateful.userAnswered();
  }

  userReadyNextQuestion(){
    this.unitSS_Stateful.userReadyForNextQuestion();
  }

}
