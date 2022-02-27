import { createAction, createReducer, on, props } from "@ngrx/store";
import { Unit } from "./models/unit";
import { initialState, UnitDictionary, UnitsState } from "./units.state";

//------------Units state Actions----------------

// This action is triggered by AppDataServer when units is retrieved from localstorage
export const getUnitsSuccess = createAction('units/getunitsSuccess', props<{units: UnitDictionary}>());

// This action triggers the unit to the updated in store
export const updateUnit = createAction('units/updateUnit', props<{unit: Unit}>());

export const deleteUnit = createAction('units/deleteUnit', props<{id: string}>());

export const updateUnitsWithFileData = createAction('units/updateUnits', props<{units: UnitDictionary}>());


//------------Units state Reducer---------------

const _unitsReducer = createReducer(initialState, 

    
    on(getUnitsSuccess, (state, action) =>{
        // update units with units from app data service
        var newState = {...state};
        newState.unitsDictionary = action.units;
        return newState;
    }),
   on(updateUnit, (state, action) =>{
    // update unit or add it to units dictionary
    var newState = {...state};
    newState.unitsDictionary = {...state.unitsDictionary};
    newState.unitsDictionary[action.unit.id] = action.unit;
    return newState;
   }),
   on(deleteUnit, (state, action) =>{
       //delete unit with id
       var newState = {...state};
       newState.unitsDictionary = {...state.unitsDictionary};
       delete newState.unitsDictionary[action.id] ;
       return newState
   }),
   on(updateUnitsWithFileData, (state, action)=>{

        var newState = {...state};
        newState.unitsDictionary = action.units;
        return newState
   })
    );

   

export function unitsReducer(state: UnitsState, action){
    return _unitsReducer(state, action);
}