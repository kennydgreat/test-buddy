import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  styleUrls: ['./create-unit.component.scss']
})
export class CreateUnitComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateUnitComponent>) { }

  ngOnInit(): void {
  }

  // closes dialog using injected dialog ref 
  closeDialog(){
    this.dialogRef.close();
  }

}
