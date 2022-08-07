import { createAction, createReducer, on, props } from "@ngrx/store";
import { UnitStudySessionState } from "../unit-study-state";

export const unitStudySessionInitialState: UnitStudySessionState = {
    unitToStudyID: "",
}

//------State Actions----------

const studyUnitAction = createAction('unitStudySessionState/setUnitToStudyID', props<{id: string}>());


//---------Action Helper Functions------------
/**
 * Calls the studyUnitAction starting a study session for unit. 
 * @param  {string} unitID
 */
export function studyUnit(unitID: string){
    return studyUnitAction({id: unitID});
}

//-----Reducer--------------


const _unitStudySessionReducer = createReducer(unitStudySessionInitialState, on(studyUnitAction, (state, action) =>{

    // return a new state with the unitToStudyId set to the id passed in, this will trigger the class who's concern is unit study sessions to start study for the unit with this id
    return {
        ...state,
        unitToStudyID: action.id
    }
}));

export function unitStudySessionReducer(state: UnitStudySessionState, action){
    return _unitStudySessionReducer(state, action);
}