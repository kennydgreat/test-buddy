import { createAction, createReducer, on, props } from "@ngrx/store";
import { ConceptStateful } from "../../concept-viewer/concept-stateful";
import { LearningState, SSConcpetProgress, UnitStudySession, UnitStudySessionsDictionary, UnitStudyState } from "../unit-study-state";

export const unitStudySessionInitialState: UnitStudyState = {
    unitToStudyID: "",
    unitsStudySessions: {},
    currentConceptToStudyID: "",
    helperText: "",
}

//------State Actions----------

const studyUnitAction = createAction('unitStudySessionState/setUnitToStudyID', props<{ id: string }>());

const updateConceptProgressAction = createAction('unitStudySessionState/updateConceptProgress', props<{ progress: SSConcpetProgress }>());

const updateCurrentConceptAction = createAction('unitStudySessionState/updateCurrentConcept', props<{ conceptID: string }>());

const updateUnitProgressAction = createAction('unitStudy/updateUnitProgress', props<{ unitProgress: UnitStudySession }>());

const updateUnitsProgressAction = createAction('unitStudy/updateUnitsProgress', props<{ unitsProgressDict: UnitStudySessionsDictionary }>());

const setTestBodyHelperTextAction = createAction('unitStudy/setTestBodyHelperText', props<{ text: string }>());

//---------Action Helper Functions------------
/**
 * Calls the studyUnitAction starting a study session for unit. 
 * @param  {string} unitID
 */
export function studyUnit(unitID: string) {
    return studyUnitAction({ id: unitID });
}

export function updateCurrentConcept(conceptID: string) {
    return updateCurrentConceptAction({ conceptID: conceptID });
}

/**
 * Sends updateUnitProgress action with unit progress passed in
 * @param  {UnitStudySession} unitProgress
 */
export function updateUnitProgress(unitProgress: UnitStudySession) {
    return updateUnitProgressAction({ unitProgress: unitProgress });
}



/**
 * Calls the setCurrentConceptAction, passing the progress object to update the
 * @param  {SSConcpetProgress} progress
 */
export function updateConceptProgress(progress: SSConcpetProgress) {
    return updateConceptProgressAction({ progress: { ...progress } });
}

/**
 * Calls the updateUnitsProgress action, passing the units progress dictionary
 * @param  {UnitStudySessionsDictionary} progressDict
 */
export function updateUnitsProgress(progressDict: UnitStudySessionsDictionary) {
    return updateUnitsProgressAction({ unitsProgressDict: { ...progressDict } });
}

export function setTestBodyHelperText(text: string) {
    return setTestBodyHelperTextAction({ text: text });
}


//-----Reducer--------------


const _unitStudySessionReducer = createReducer(unitStudySessionInitialState, on(studyUnitAction, (state, action) => {

    // //create new unit study progress object for unit if it doesn't already exist
    // var unitSession = state.unitsStudySessions[action.id] ? state.unitsStudySessions[action.id] : {
    //     unitID: action.id,
    //     concepts: {},
    // };

    // //update unit study sessions dict with unit progress
    // var sessionsDict = {...state.unitsStudySessions };
    // sessionsDict[action.id] = unitSession;

    // return a new state with the unitToStudyId set to the id passed in, this will trigger the class who's concern is unit study sessions to start study for the unit with this id
    return {
        ...state,
        unitToStudyID: action.id,
        //unitsStudySessions : sessionsDict
    }
}),
    on(updateConceptProgressAction, (state, action) => {
        // create unit study session progress object
        var unitStudySessionProgress = { ...state.unitsStudySessions[state.unitToStudyID] };

        //update unit progress with concept progress
        unitStudySessionProgress.concepts[action.progress.id] = action.progress;

        // create new state
        var newState = { ...state };
        newState.unitsStudySessions[state.unitToStudyID] = unitStudySessionProgress;

        return newState;
    }),
    on(updateCurrentConceptAction, (state, action) => (
        {
            ...state,
            currentConceptToStudyID: action.conceptID
        }
    )),
    on(updateUnitProgressAction, (state, action) => {
        //update unit progress / add to dict
        var newState = { ...state };
        newState.unitsStudySessions = { ...state.unitsStudySessions };
        newState.unitsStudySessions[action.unitProgress.unitID] = action.unitProgress;
        return newState;
    }),
    on(updateUnitsProgressAction, (state, action) => (
        {
            ...state,
            unitsStudySessions: action.unitsProgressDict,
        }
    )),
    on(setTestBodyHelperTextAction, (state, action) => (
        {
            ...state,
            helperText: action.text
        }
    ))
);

export function unitStudySessionReducer(state: UnitStudyState, action) {
    return _unitStudySessionReducer(state, action);
}