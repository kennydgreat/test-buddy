import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConceptHelper } from '../ngrx-store/concept-helper';
import { Unit } from '../ngrx-store/models/unit';
import { UnitHelper } from '../ngrx-store/unit-helper';
import { conceptAdded } from '../ngrx-store/unit.reducer';
import { AppState } from '../ngrx-store/units.state';

@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  styleUrls: ['./create-unit.component.scss'],
  animations:[
    // the animation for added root concepts, the view is fades in
    trigger('scaleUpRightEnter', [
      // the transition for inserted concept viewer, which makes the view fade in
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate('100ms', style({
          opacity: 1,
        }))
      ])
    ])
  ]
})
export class CreateUnitComponent implements OnInit {

  unit: Unit
  unitHelper: UnitHelper = new UnitHelper();
  constructor(public dialogRef: MatDialogRef<CreateUnitComponent>, private store: Store<AppState>) {
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
    // add new concepts by recreating concept array
    this.unit.concepts = [...this.unit.concepts, this.unitHelper.createNewRootConcept()];
    // save the change in the store by creating a new unit.
    this.store.dispatch(conceptAdded({unit: {...this.unit}}));
  }

}
