import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../ngrx-store/models/unit';
import { UnitHelper } from '../ngrx-store/unit-helper';
import { UnitDictionary } from '../ngrx-store/units.state';

@Injectable({
  providedIn: 'root'
})

//Responible for getting and saving app data in local storage
export class AppDataService {
  // units 
  unitHelper: UnitHelper = new UnitHelper();
  units: UnitDictionary = {}
  constructor() { }

  //gets units 
  getUnits(){
    var unit = this.unitHelper.createNewUnit();
    unit.name = "Subject";
    var units = {};
    units[unit.id] = unit;
    return new Observable<UnitDictionary>( (observer) => {
      observer.next(units);
    });
  }
}
