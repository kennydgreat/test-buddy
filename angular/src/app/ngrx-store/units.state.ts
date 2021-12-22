import { createSelector } from "@ngrx/store";
import { Unit } from "./models/unit";

export interface UnitsState {
    units : Unit[]
}

// initial state

export const initialState : UnitsState = {
    units: []
}

// units selector
export const selectUnits = createSelector((state: UnitsState) => state, (state: UnitsState) => state.units );