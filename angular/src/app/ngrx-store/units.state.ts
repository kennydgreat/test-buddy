import { createSelector } from "@ngrx/store";
import { Unit } from "./models/unit";

export interface UnitsState {
    units : Unit[]
}

export interface AppState {
    units: UnitsState
}

// initial state

export const initialState : UnitsState = {
    units: []
}

// units selector
export const selectUnits = createSelector((state: AppState) =>state.units, (units: UnitsState) => units.units );