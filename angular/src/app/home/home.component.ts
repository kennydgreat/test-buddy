import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateUnitComponent } from '../create-unit/create-unit.component';
import { AppDataEffects } from '../ngrx-store/app-data-effects';
import { Unit } from '../ngrx-store/models/unit';
import { AppState, selectUnits as selectUnitsList, UnitsState } from '../ngrx-store/units.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //units stream
  units$: Observable<Unit[]>
  units: Unit[]

  
  constructor(private store: Store<AppState>, public createUnitDialog: MatDialog) {
    //connect units stream to units from units state
    this.units$ = this.store.select(selectUnitsList);
   }

  ngOnInit(): void {
    //dispatchs action to get units from storage
    this.store.dispatch(AppDataEffects.getUnitsFromStorage());
  }

  //opens the create unit dialog
  openDialog(): void{
    const dialogRef = this.createUnitDialog.open(CreateUnitComponent,{
      // to make dialog full-screen
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: `100%`,
      height: `100%`,
      hasBackdrop: false,
      panelClass: 'full-screen-dialog'
    });

  }

}
