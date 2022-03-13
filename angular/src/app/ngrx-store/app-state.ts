import { createSelector } from "@ngrx/store";
import { ErrorDictionary } from "./models/error-message";
import { UnitsState } from "./unit-state";

export interface AppState {
    units: UnitsState;
}

// units selector
export const selectUnits = createSelector((state: AppState) =>state.units, (units: UnitsState) => Object.values(units.unitsDictionary) );

// errorDictionary list selector
export const selectErrorMessages = createSelector((state: AppState) => state.units.errorDictionary, (errorDict: ErrorDictionary) => {
    return Object.values(errorDict);
});