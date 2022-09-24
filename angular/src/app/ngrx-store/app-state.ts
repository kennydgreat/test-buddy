import { createSelector } from "@ngrx/store";
import { ErrorDictionary } from "./models/error-message";
import { UnitStateful } from "../unit-viewer/unit-stateful";
import { SettingsState } from "./reducers/settings.reducer";
import { UnitDictionary, UnitsState } from "./unit-state";
import { UnitStudyState as UnitStudyState } from "./unit-study-state";

export interface AppState {
    units: UnitsState;
    settings: SettingsState;
    unitStudy: UnitStudyState
}

// units selector for array of units
export const selectUnitsAsArray = createSelector((state: AppState) =>state.units, (units: UnitsState) => {
    // return array of units not to be deleted
    return Object.values(units.unitsDictionary).filter(unit => !unit.toBeDeleted)
} );

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

/**
 * Returns units to be delete dictionaru as array
 */
export const selectUnitsTobeDeletedList = createSelector((state: AppState) => state.units, (units: UnitsState) => {
    return Object.values(units.unitDeleteItemDictionary);
})

