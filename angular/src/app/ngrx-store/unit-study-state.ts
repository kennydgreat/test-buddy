import { createSelector } from "@ngrx/store";
import { AppState, selectUnitsDictionary } from "./app-state";
import { UnitStateful } from "./models/unit-stateful";
import { UnitStateless } from "./models/unit-stateless";
import { UnitDictionary } from "./unit-state";

export interface UnitStudyState {

    unitToStudyID: string;
    unitsStudySessions: UnitStudySessionsDictionary;
    currentConceptToStudyID: string

}

/**
 * This represent learning progress of a concept during a study session
 */
export interface SSConcpetProgress {
    id: string;
    name: string;
    learnt: boolean;
    definition: ConceptAspectProgress;
    subconceptRelationship: {
        state: ConceptAspectProgress,
        subconcepts: SubconceptsRelationProgress
    };
    subconceptOrder: ConceptAspectProgress;
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


/**
 * This represents the learning progress of a unit's concepts
 */
export interface SSConceptProgressDictionary {
    [key: string]: SSConcpetProgress;
}

/**
 * Represents the study progress of a unit
 */
export interface UnitStudySession {
    unitID: string;
    concepts: SSConceptProgressDictionary;
}

/**
 * Represents the study progress of all units
 */
export interface UnitStudySessionsDictionary {
    [key: string]: UnitStudySession;
}

export type ConceptAspectProgress = {
    present: boolean,
    progress: LearningProgressStates,
};

export type LearningProgressStates = "undone" | "doing" | "recalled" | "not-recalled";

export const LearningState = {
    undone: "undone" as LearningProgressStates,
    doing: "doing" as LearningProgressStates,
    recalled: "recalled" as LearningProgressStates,
    notRecalled: "not-recalled" as LearningProgressStates,
};

export const selectUnitToStudyID = createSelector((state: AppState) => state.unitStudy, (unitStudy) => unitStudy.unitToStudyID);

/**
 * gets the study unit to be studyied
 */
export const selectUnitToStudyStateless = createSelector(selectUnitToStudyID, selectUnitsDictionary, (unitToStudyID: string, units: UnitDictionary) => {
    return units[unitToStudyID];
});


/**
 * Gets the unit stateless data and the progress
 */
export const selectUnitStatelessWithProgress = createSelector((state: AppState) => state.unitStudy, selectUnitToStudyStateless, (unitStudy: UnitStudyState, unit: UnitStateless): { unit: UnitStateless, unitProgress: UnitStudySession } => {
    return {
        unit: unit,
        unitProgress: unitStudy[unit.id]
    }
});

export const selectCurrentConceptProgress = createSelector((state: AppState) => state.unitStudy.unitsStudySessions, selectUnitToStudyID, (state: AppState) => state.unitStudy.currentConceptToStudyID, (unitsStudySessions: UnitStudySessionsDictionary, unitToStudyID: string, currentConceptID: string) => {

    if (unitToStudyID === '') {
        // unit is not being studied
        return {}
    }

    var currentConceptProgress = unitsStudySessions[unitToStudyID].concepts[currentConceptID];

    return {
        definition: currentConceptProgress.definition,
        subconcept: currentConceptProgress.subconceptRelationship.state,
        subconceptOrder: currentConceptProgress.subconceptOrder
    }
});

export type UIConceptProgress = {
    definition: ConceptAspectProgress,
    subconcept: ConceptAspectProgress,
    subconceptOrder: ConceptAspectProgress,
}
