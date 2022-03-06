import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DiscardChangesDialogComponent } from '../discard-changes-dialog/discard-changes-dialog.component';
import { ConceptHelper } from '../ngrx-store/concept-helper';
import { Unit } from '../ngrx-store/models/unit';
import { UnitHelper } from '../ngrx-store/unit-helper';
import { updateUnit, deleteUnit } from '../ngrx-store/unit.reducer';
import { AppState } from '../ngrx-store/app-state';
import { AppDataService } from '../app-data-service/app-data.service';

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
  constructor(public dialogRef: MatDialogRef<CreateUnitComponent>, private store: Store<AppState>, public discardChangesDialog: MatDialog, private appDataService: AppDataService) {
    this.unit = this.unitHelper.createNewUnit();
   }

  ngOnInit(): void {
  }

  // closes dialog using injected dialog ref 
  closeDialog(){
    // check the unit is empty
    if (this.unitHelper.isUnitEmtpy(this.unit)){

      // delete unit 
      this.store.dispatch(deleteUnit({id: this.unit.id}));
      // close the dialog
      this.dialogRef.close();
      return;
    }

    // the unit has data, open discard changes dialog
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
    this.unit = this.unitHelper.addNewRootConcept(this.unit);

    // save the change in the store by creating a new unit.
    this.store.dispatch(updateUnit({unit: {...this.unit}}));
  }

  //saves unit in store 
  unitDetailsChange(){
    // save the change in the store by creating a new unit.
    this.store.dispatch(updateUnit({unit: {...this.unit}}));
  }

  // user is done
  done(){
    if (this.unitHelper.isUnitEmtpy(this.unit)){
      // delete unit 
      this.store.dispatch(deleteUnit({id: this.unit.id}));
    }else{
      // update unit in store (unit changes should have been in the store anyway, this is to make ensure no changes are lost)
    this.store.dispatch(updateUnit({unit: {...this.unit}}));

    //****DELETE AFTER */
    //this.appDataService.unitsDictionary[this.unit.id] = this.unit;
    }

    // close the dialog
    this.dialogRef.close();

  }

}
