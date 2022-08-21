import { createSelector } from "@ngrx/store";
import { AppState, selectUnitsDictionary } from "./app-state";
import { UnitDictionary } from "./unit-state";

export interface UnitStudySessionState {

    unitToStudyID: string;
}

/**
 * This represent learning progress of a concept during a study session
 */
export interface SSConcpetProgress {
    id: string;
    name: string;
    learnt: boolean;
    definition: boolean;
    subconceptRelationship: {
        recalled: boolean,
        progress: SubconceptsRelationProgress
    };
}

/**
 * This represent the progress of a subconcept relation, whether it is remembered or not 
 */
export interface SubconceptRelationProgress {
    subconceptId: string;
    relationshipRecalled: boolean;
}

/**
 * This represent learning progress of concept  to subconcept relationships a user can  recall 
 */
export interface SubconceptsRelationProgress {
    [key: string]: SubconceptRelationProgress;
}



export interface SSConceptProgressDictionary {
    [key: string]: SSConcpetProgress;
}


export const selectUnitToStudyID = createSelector((state: AppState) => state.unitStudy, (unitStudy) => unitStudy.unitToStudyID);

/**
 * gets the study unit to be studyied
 */
export const selectUnitToStudyStateless = createSelector(selectUnitToStudyID, selectUnitsDictionary, (unitToStudyID: string, units: UnitDictionary) => {
    return units[unitToStudyID];
});