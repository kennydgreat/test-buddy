import { createSelector } from "@ngrx/store";
import { AppState } from "./app-state";
import { Unit } from "./models/unit";

export interface UnitDictionary {
    [key: string]: Unit;
}
export interface UnitsState {
    unitsDictionary : UnitDictionary
}

// initial state

export const initialState : UnitsState = {
    unitsDictionary: {}
}

// units selector
export const selectUnits = createSelector((state: AppState) =>state.units, (units: UnitsState) => Object.values(units.unitsDictionary) );