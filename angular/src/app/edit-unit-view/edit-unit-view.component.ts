import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectUnitEditStateless } from '../ngrx-store/app-state';
import { UnitStateful } from '../ngrx-store/models/unit-stateful';
import { UnitStateless } from '../ngrx-store/models/unit-stateless';

@Component({
  selector: 'app-edit-unit-view',
  templateUrl: './edit-unit-view.component.html',
  styleUrls: ['./edit-unit-view.component.scss']
})
export class EditUnitViewComponent implements OnInit {

  unit: UnitStateful = new UnitStateful(undefined);
  unit$ : Observable<UnitStateless>;
  unitAction = "Edit Unit" ;
  unitChanged = false;
  constructor(private store : Store<AppState>, public dialogRef: MatDialogRef<EditUnitViewComponent>) { 
    this.unit$ = this.store.select(selectUnitEditStateless);

    // subscribe to changes to the observable to get the data
    this.unit$.subscribe(
      {
        next:(unit: UnitStateless) =>{
          // check the unit  id of the comp unit and unit from store. if they are same they don't need to changed again
          if(unit.id == this.unit.id){
            // the unit was recently changed
            this.unitChanged = true;
            
          }else{
            // the id's of the comp.'s unit and the unit from the store are different so the comp's unit is a random unit created when the comp. is first created

            // create a stateful version for the unit
          const unitStateful = new UnitStateful(store);
          unitStateful.copyInStatelessData(unit);
          // set the unit stateful
          this.unit = unitStateful;
          }
        }
      }
    );
  }

  ngOnInit(): void {
  }

  closeDialog(){
    // check if that unit was changed
    if(!this.unitChanged){
      // the unit did not change so close the dialog
      this.dialogRef.close();
      return;
    }
  }

  done(){
    this.dialogRef.close();
  }


}
