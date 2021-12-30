import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConceptHelper } from '../ngrx-store/concept-helper';
import { Unit } from '../ngrx-store/models/unit';
import { UnitHelper } from '../ngrx-store/unit-helper';

@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  styleUrls: ['./create-unit.component.scss']
})
export class CreateUnitComponent implements OnInit {

  unit: Unit
  unitHelper: UnitHelper = new UnitHelper();
  constructor(public dialogRef: MatDialogRef<CreateUnitComponent>) {
    this.unit = this.unitHelper.createNewUnit();
   }

  ngOnInit(): void {
  }

  // closes dialog using injected dialog ref 
  closeDialog(){
    this.dialogRef.close();
  }

  //adding a concept
  addConcept(){
    this.unit.concepts.push(this.unitHelper.createNewRootConcept());
  }

}
