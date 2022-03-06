import { createSelector } from "@ngrx/store";
import { AppState } from "./app-state";
import { ErrorDictionary } from "./models/error-message";
import { Unit } from "./models/unit";

export interface UnitDictionary {
    [key: string]: Unit;
}
export interface UnitsState {
    unitsDictionary : UnitDictionary;
    errorDictionary: ErrorDictionary;
}

// initial state

export const initialState : UnitsState = {
    unitsDictionary: {},
    errorDictionary: {}
}
