import { createAction, createReducer, on, props } from "@ngrx/store";
import { Error } from "./models/error-message";
import { UnitStateless } from "./models/unit-stateless";
import { unitInitialState, UnitDictionary, UnitsState } from "./unit-state";
import { v1 as timeStampUUID } from 'uuid';

//------------Units state Actions----------------

// This action is triggered by AppDataServer when units is retrieved from localstorage
export const getUnitsSuccess = createAction('units/getunitsSuccess', props<{units: UnitDictionary}>());

// This action triggers the unit to the updated in store
export const updateUnitAction = createAction('units/updateUnit', props<{unit: UnitStateless}>());

export const deleteUnitAction = createAction('units/deleteUnit', props<{id: string}>());

export const updateUnitsWithFileData = createAction('units/updateUnitsWithFileData', props<{units: UnitDictionary}>());

export const reportErrorAction = createAction('units/reportError', props<{title: string, message: string, actionType: string}>());

export const hideErrorAction = createAction('units/hideError', props<{id: string}>()); 

export const editUnitAction = createAction('units/editUnit',props<{id: string}>());


//------------Unit State Action helper functions----------------
/**
 * update a unit in the store with new unit 
 * @param  {UnitStateless} unit new unit
 */
export function updateUnit(unit: UnitStateless){
    return updateUnitAction({unit: {...unit}});
}

export function reportError(title: string, message: string) {
    return reportErrorAction({title: title, message: message, actionType: ""});
}
/**
 * Returns a call to the hide error action
 * @param  {string} id id of error to hide
 */
export function hideError(id: string) {
    
    return hideErrorAction({id: id});
}
/**
 * Calls editUnit Action. edit unit updates the unitEditID in the store which is used by editting component to get the right unit
 * @param  {string} id
 */
export function editUnit(id: string){
    return editUnitAction({id: id});
}

export function deleteUnit(id: string){
    return deleteUnitAction({id: id});
}



//------------Units state Reducer---------------

const _unitsReducer = createReducer(unitInitialState, 

    
    on(getUnitsSuccess, (state, action) =>{
        // update units with units from app data service
        var newState = {...state};
        newState.unitsDictionary = action.units;
        return newState;
    }),
   on(updateUnitAction, (state, action) =>{
    // update unit or add it to units dictionary
    var newState = {...state};
    newState.unitsDictionary = {...state.unitsDictionary};
    newState.unitsDictionary[action.unit.id] = action.unit;
    return newState;
   }),
   on(deleteUnitAction, (state, action) =>{
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
   }),
   on(editUnitAction, (state,  action) =>(
       {
           ...state,
           unitToEditID: action.id
       }
   ))
    );

   

export function unitsReducer(state: UnitsState, action){
    return _unitsReducer(state, action);
}