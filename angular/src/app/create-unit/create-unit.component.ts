import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DiscardChangesDialogComponent } from '../discard-changes-dialog/discard-changes-dialog.component';
import { ConceptHelper } from '../ngrx-store/concept-helper';
import { Unit } from '../ngrx-store/models/unit';
import { UnitHelper } from '../ngrx-store/unit-helper';
import { conceptAdded, deleteUnit } from '../ngrx-store/unit.reducer';
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
  constructor(public dialogRef: MatDialogRef<CreateUnitComponent>, private store: Store<AppState>, public discardChangesDialog: MatDialog) {
    this.unit = this.unitHelper.createNewUnit();
   }

  ngOnInit(): void {
  }

  // closes dialog using injected dialog ref 
  closeDialog(){
    // open discard changes dialog
    const discardChangesdialogRef = this.discardChangesDialog.open(DiscardChangesDialogComponent);

    //on close button call button
    discardChangesdialogRef.afterClosed().subscribe((discardChanges: boolean) => {
      if(discardChanges){

        // delete unit 
        this.store.dispatch(deleteUnit({id: this.unit.id}));
        // close the dialog
        this.dialogRef.close();
      }
    });
  }

  //adding a concept
  addConcept(){
    // add new concepts by recreating concept array
    this.unit.concepts = [...this.unit.concepts, this.unitHelper.createNewRootConcept()];
    // save the change in the store by creating a new unit.
    this.store.dispatch(conceptAdded({unit: {...this.unit}}));
  }

}
