import { createSelector } from "@ngrx/store";
import { AppState } from "./app-state";
import { ErrorDictionary } from "./models/error-message";
import { UnitStateless } from "./models/unit-stateless";
import { UnitDeleteItemDictionary } from "./models/UnitDeleteItem";

export interface UnitDictionary {
    [key: string]: UnitStateless;
}



export interface UnitsState {
    unitsDictionary : UnitDictionary;
    unitToEditID: string;
    errorDictionary: ErrorDictionary;
    unitDeleteItemDictionary: UnitDeleteItemDictionary; 
}

// initial state

export const unitInitialState : UnitsState = {
    unitsDictionary: {},
    unitToEditID: "",
    errorDictionary: {},
    unitDeleteItemDictionary: {},
}
