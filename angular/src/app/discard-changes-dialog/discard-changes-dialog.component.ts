import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-discard-changes-dialog',
  templateUrl: './discard-changes-dialog.component.html',
  styleUrls: ['./discard-changes-dialog.component.scss']
})
export class DiscardChangesDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DiscardChangesDialogComponent>) { }

  ngOnInit(): void {
  }

  cancel(){
    // close the dialog and pass the false for not discarding changes
    this.dialogRef.close(false);
  }

  discardChanges(){
    // close the dialog and pass true for discarding changes
    this.dialogRef.close(true);
  }
}
