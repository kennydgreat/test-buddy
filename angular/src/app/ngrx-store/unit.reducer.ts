import { createAction, createReducer, on } from "@ngrx/store";
import { initialState, UnitsState } from "./units.state";

//------------Units state Actions----------------
export const getUnits = createAction('units/getunits');

//------------Units state Reducer---------------

const _unitsReducer = createReducer(initialState, 

    
    on(getUnits, (state) =>{
        return state;
    })
    );

export function unitsReducer(state: UnitsState, action){
    return _unitsReducer(state, action);
}