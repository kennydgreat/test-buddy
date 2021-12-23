import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppDataEffects } from '../ngrx-store/app-data-effects';
import { Unit } from '../ngrx-store/models/unit';
import { AppState, selectUnits, UnitsState } from '../ngrx-store/units.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //units stream
  units$: Observable<Unit[]>
  units: Unit[]
  constructor(private store: Store<AppState>) {
    //connect units stream to units from units state
    this.units$ = this.store.select(selectUnits);
   }

  ngOnInit(): void {
    //dispatchs action to get units from storage
    this.store.dispatch(AppDataEffects.getUnitsFromStorage());
  }

}
