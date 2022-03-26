import { createAction, createReducer, on, props } from "@ngrx/store";

export interface SettingsState{
    dataFileName: string;
}

export const settingsInitialState : SettingsState = {
    dataFileName: ""
}

//-------State actions--------

export const updateDataFileNameAction = createAction('settings/updateFileName', props<{dataFileName: string}>());

//------Action helper function
/**
 * Returns a action to be dispatched that will set the data file name
 * @param  {string} dataFileName new name of the data file used by app
 */
export function updateDataFileName(dataFileName: string){
    return updateDataFileNameAction({dataFileName: dataFileName});
}

//------------Reducer----------

const _settingsReducer = createReducer(settingsInitialState, on(updateDataFileNameAction, (state, action) => {
    var newState = {...state};
    newState.dataFileName = action.dataFileName;
    return newState;
}))

export function settingsReducer(state: SettingsState, action){
    return _settingsReducer(state, action);
}