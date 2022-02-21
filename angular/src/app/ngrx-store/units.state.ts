import { createSelector } from "@ngrx/store";
import { Unit } from "./models/unit";

export interface UnitDictionary {
    [key: string]: Unit;
}
export interface UnitsState {
    unitsDictionary : UnitDictionary
}

export interface AppState {
    units: UnitsState
}

// initial state

export const initialState : UnitsState = {
    unitsDictionary: {}
}

// units selector
export const selectUnits = createSelector((state: AppState) =>state.units, (units: UnitsState) => Object.values(units.unitsDictionary) );