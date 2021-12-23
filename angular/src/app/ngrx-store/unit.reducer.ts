import { createAction, createReducer, on, props } from "@ngrx/store";
import { Unit } from "./models/unit";
import { initialState, UnitsState } from "./units.state";

//------------Units state Actions----------------
export const getUnitsSuccess = createAction('units/getunitsSuccess', props<{units: Unit[]}>());

//------------Units state Reducer---------------

const _unitsReducer = createReducer(initialState, 

    
    on(getUnitsSuccess, (state, action) =>{
        var newState = {...state};
        newState.units = action.units;
        return newState;
    })
    );

export function unitsReducer(state: UnitsState, action){
    return _unitsReducer(state, action);
}