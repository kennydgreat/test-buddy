import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DiscardChangesDialogComponent } from '../discard-changes-dialog/discard-changes-dialog.component';
import { AppState } from '../ngrx-store/app-state';
import { AppDataService } from '../app-data-service/app-data.service';
import { UnitStateful } from '../ngrx-store/models/unit-stateful';

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

  unit: UnitStateful
  constructor(public dialogRef: MatDialogRef<CreateUnitComponent>, private store: Store<AppState>, public discardChangesDialog: MatDialog,) {
    this.unit = new UnitStateful(store);
   }

  ngOnInit(): void {
  }

  // closes dialog using injected dialog ref 
  closeDialog(){
    // check the unit is empty
    if (this.unit.isEmpty()){

      // delete unit 
      this.unit.deleteUnitInStore()
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
        this.unit.deleteUnitInStore()
        // close the dialog
        this.dialogRef.close();
      }
    });
  }

  //adding a concept
  addConcept(){
    // add a new concept
    this.unit.addNewRootConcept();

    // save the change in the store
    this.unit.updateUnitInStore()
  }

  //saves unit in store 
  unitDetailsChange(){
    // save the change in the store by creating a new unit.
    this.unit.updateUnitInStore();
  }

  conceptChanged(){
    //concept changed, update unit in store
    this.unit.updateUnitInStore();
  }

  // user is done
  done(){
    if (this.unit.isEmpty()){
      // delete unit 
      this.unit.deleteUnitInStore();
    }else{
      // update unit in store (unit changes should have been in the store anyway, this is to make ensure no changes are lost)
    this.unit.updateUnitInStore()
    }

    // close the dialog
    this.dialogRef.close();

  }

}
