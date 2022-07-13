import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.scss']
})
export class StudySessionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StudySessionComponent>) { }

  ngOnInit(): void {
  }

  // user chooses to end the session
  close(){
    //close the dialog, the user's progress should already presisted so it is safe to end the session
    this.dialogRef.close();
  }

}
