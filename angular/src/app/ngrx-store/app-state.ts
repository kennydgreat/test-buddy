import { createSelector } from "@ngrx/store";
import { ErrorDictionary } from "./models/error-message";
import { UnitStateful } from "./models/unit-stateful";
import { SettingsState } from "./settings.reducer";
import { UnitDictionary, UnitsState } from "./unit-state";

export interface AppState {
    units: UnitsState;
    settings: SettingsState;
}

// units selector for array of units
export const selectUnitsAsArray = createSelector((state: AppState) =>state.units, (units: UnitsState) => Object.values(units.unitsDictionary) );

// errorDictionary list selector
export const selectErrorMessages = createSelector((state: AppState) => state.units.errorDictionary, (errorDict: ErrorDictionary) => {
    return Object.values(errorDict);
});

// units dictionary selector
export const selectUnitsDictionary = createSelector((state: AppState) => state.units, (units) => units.unitsDictionary);

export const selectEditUnit = createSelector( (state: AppState) =>state.units.unitToEditID, (unitToEditID) => unitToEditID);

// selector for the unit to be edit this selector also turns the unit into a stateful 
export const selectUnitEditStateless = createSelector(selectUnitsDictionary, selectEditUnit, (units : UnitDictionary, unitToEditID: string) =>{
    return units[unitToEditID];
});