import { createAction, createReducer, on, props } from "@ngrx/store";
import { Error } from "./models/error-message";
import { Unit } from "./models/unit";
import { initialState, UnitDictionary, UnitsState } from "./unit-state";
import { v1 as timeStampUUID } from 'uuid';

//------------Units state Actions----------------

// This action is triggered by AppDataServer when units is retrieved from localstorage
export const getUnitsSuccess = createAction('units/getunitsSuccess', props<{units: UnitDictionary}>());

// This action triggers the unit to the updated in store
export const updateUnit = createAction('units/updateUnit', props<{unit: Unit}>());

export const deleteUnit = createAction('units/deleteUnit', props<{id: string}>());

export const updateUnitsWithFileData = createAction('units/updateUnitsWithFileData', props<{units: UnitDictionary}>());

export const reportErrorAction = createAction('units/reportError', props<{title: string, message: string, actionType: string}>());

export const hideErrorAction = createAction('units/hideError', props<{id: string}>()); 

//------------Unit State Action helper functions----------------
export const reportError = (title: string, message: string) => {
    return reportErrorAction({title: title, message: message, actionType: ""});
}

export const hideError = (id: string) => {
    
    return hideErrorAction({id: id});
}

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
   }), 
   // Add an error to the list of errors
   on(reportErrorAction, (state, action) => {
    const id = timeStampUUID();
    var newState = {...state};
    newState.errorDictionary = {...state.errorDictionary};
    newState.errorDictionary[id] = {
        id: id,
        title: action.title,
        message: action.message,
        actionType: action.actionType,
        time: Date(),
        show: true
    };
    return newState
   }),
   on(hideErrorAction, (state, action) => {
       var newState = {...state};
       newState.errorDictionary = {...state.errorDictionary};
       // get error
       var error = {...newState.errorDictionary[action.id]};
       error.show = false;
       newState.errorDictionary[action.id] = error;
       return newState;
   })
    );

   

export function unitsReducer(state: UnitsState, action){
    return _unitsReducer(state, action);
}