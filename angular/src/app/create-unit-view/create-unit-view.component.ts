import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DiscardChangesDialogComponent } from '../discard-changes-dialog/discard-changes-dialog.component';
import { AppState } from '../ngrx-store/app-state';
import { UnitStateful } from '../ngrx-store/models/unit-stateful';

@Component({
  selector: 'app-create-unit-view',
  templateUrl: './create-unit-view.component.html',
  styleUrls: ['./create-unit-view.component.scss']
})
export class CreateUnitViewComponent implements OnInit {

  unit: UnitStateful
  unitAction: string = "Create a Unit";
  constructor(public dialogRef: MatDialogRef<CreateUnitViewComponent>, private store: Store<AppState>, public discardChangesDialog: MatDialog) {
    this.unit = new UnitStateful(store);
  }

  ngOnInit(): void {
  }

  //closes dialog using injected dialog ref
  closeDialog() {
    // check the unit empty
    if (this.unit.isEmpty()) {

      // delete unit
      this.unit.deleteUnitInStore();

      // close the dialog
      this.dialogRef.close();
      return;
    }

    // the unit has data, open discard changes dialog
    const discardChangesdialogRef = this.discardChangesDialog.open(DiscardChangesDialogComponent);

    //on close button call button
    discardChangesdialogRef.afterClosed().subscribe((discardChanges: boolean) => {
      if (discardChanges) {
        // delete unit
        this.unit.deleteUnitInStore();
        // close the dialog
        this.dialogRef.close();
      }
    });
  }
  // user is done
  done() {
    if (this.unit.isEmpty()) {
      // delete unit 
      this.unit.deleteUnitInStore();
    } else {
      // update unit in store (unit changes should have been in the store anyway, this is to make ensure no changes are lost)
      this.unit.updateUnitInStore()
    }

    // close the dialog
    this.dialogRef.close();

  }


}
