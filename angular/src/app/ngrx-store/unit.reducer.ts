import { createAction, createReducer, on, props } from "@ngrx/store";
import { Unit } from "./models/unit";
import { initialState, UnitDictionary, UnitsState } from "./units.state";

//------------Units state Actions----------------

// This action is triggered by AppDataServer when units is retrieved from localstorage
export const getUnitsSuccess = createAction('units/getunitsSuccess', props<{units: UnitDictionary}>());

// This action is to unit (or the unit's changes if it already exist) in the store
export const conceptAdded = createAction('units/conceptAdded', props<{unit: Unit}>());

//------------Units state Reducer---------------

const _unitsReducer = createReducer(initialState, 

    
    on(getUnitsSuccess, (state, action) =>{
        // update units with units from app data service
        var newState = {...state};
        newState.units = action.units;
        return newState;
    }),
   on(conceptAdded, (state, action) =>{
    // update unit or add it to units dictionary
    var newState = {...state};
    newState.units = {...state.units};
    newState.units[action.unit.id] = action.unit;
    return newState;
   }),
    );

   

export function unitsReducer(state: UnitsState, action){
    return _unitsReducer(state, action);
}