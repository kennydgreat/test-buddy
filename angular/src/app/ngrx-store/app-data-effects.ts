import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createAction } from "@ngrx/store";
import { exhaustMap, map } from "rxjs/operators";
import { AppDataService } from "../units-service/app-data.service";
import { Unit } from "./models/unit";
import { getUnitsSuccess } from "./unit.reducer";
import { UnitDictionary } from "./units.state";

//responsible for listening for data retrivial actions, completing request using service and firing the right action to the store when done.
@Injectable()
export class AppDataEffects{

    //------Actions---------

    public static getUnitsFromStorage = createAction('appDataEffects/getUnitsFromStorage');

    //------effects---------
    //listens on for the getUnitsFromStorage action and gets units
    getUnit$ = createEffect(() => this.actions$.pipe(
        //listen  for getUnitsFromStorage action
        ofType(AppDataEffects.getUnitsFromStorage),
        // "flatten" action stream into new observable
        exhaustMap(
            // call appDataService get units
            () => this.appDataService.getUnits().pipe(
        
            map(
                // dispatch getUnitsSuccess action when service observable done, passing returned units
               ( units: UnitDictionary) => getUnitsSuccess({units}))
        ))
    ));

    constructor(private actions$: Actions, private appDataService: AppDataService){

    }
}