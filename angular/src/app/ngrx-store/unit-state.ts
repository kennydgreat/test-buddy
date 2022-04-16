import { createSelector } from "@ngrx/store";
import { AppState } from "./app-state";
import { ErrorDictionary } from "./models/error-message";
import { UnitStateless } from "./models/unit-stateless";

export interface UnitDictionary {
    [key: string]: UnitStateless;
}
export interface UnitsState {
    unitsDictionary : UnitDictionary;
    errorDictionary: ErrorDictionary;
}

// initial state

export const unitInitialState : UnitsState = {
    unitsDictionary: {},
    errorDictionary: {}
}
