import { Store } from "@ngrx/store";
import { MultipleChoiceQuestionBuilder } from "src/app/study-session/multiple-choice-question-builder";
import { AppState } from "../../app-state";
import { selectUnitToStudyStateless, SSConceptProgressDictionary } from "../../unit-study-state";
import { ConceptStateful } from "../concept-stateful";
import { UnitStateful } from "../unit-stateful";
import { UnitStateless } from "../unit-stateless";
import { MultipleChoiceQuestion } from "./multiple-choice-question";

/**
 * Represents the stateful version of a unit study session data
 */
export class UnitSS_Stateful {

    unit: UnitStateful;
    unitID: string
    unitNameForStudySession: string;
    currentConcept: string;
    ssConceptProgressDictionary: SSConceptProgressDictionary;
    currentQuestion: MultipleChoiceQuestion;



    constructor(public store: Store<AppState>) {

        this.ssConceptProgressDictionary = {};

        //use selector to get unit to study
        let $unit = this.store.select(selectUnitToStudyStateless);

        // subscribe to cahnges to the obserable to get the unit
        $unit.subscribe(

            {
                next: (unitFromStore: UnitStateless) => {
                    this.unit = new UnitStateful(store);
                    this.unit.copyInStatelessData(unitFromStore);
                    this.unitNameForStudySession = this.unit.name
                    this.unitID = this.unit.id;
                    this.setNextQuestion(this.findNextConceptInUnit());
                }
            }
        );

    }

    /**
     * Atempts to find the next concept for a question in the unit
     * @returns ConceptStateful
     */
    findNextConceptInUnit() : ConceptStateful | undefined {
        for(var i = 0; i < this.unit.concepts.length; i++){
            var curConcept = this.findNextConceptTree(this.unit.concepts[i], false);
            if (curConcept){
               return curConcept;
            }
        }
        return undefined;
    }
    
    /**
     * Attempt to find the next concept for a question in the concept tree, return undefined if it can't find one
     * @param  {ConceptStateful} concept
     * @param  {boolean} nextconceptFound
     * @returns ConceptStateful
     */
    findNextConceptTree(concept: ConceptStateful, nextconceptFound: boolean): ConceptStateful | undefined {

        // check that a concept hasn't been found
        if (nextconceptFound) {
            return undefined;
        }

        // check that the concept is extended (has information learn)
        if (!concept.isExtended()) {
            // the concept is not extended it can be skipped
            return undefined;
        }

        if (!this.isConceptLearnt(concept) && this.canMakeQuestion(concept)) {
            nextconceptFound = true;
            return concept;

        } else {
            // the have been learnt go through sub-concept if they are present
            if (concept.hasSubconcepts()) {

                for (var i = 0; i < concept.subconcepts.length; i++) {

                    if (concept.subconcepts[i].isExtended()) {

                        let nextConcept = this.findNextConceptTree(concept.subconcepts[i], nextconceptFound);

                        if (nextConcept) {
                            return nextConcept;
                        }

                    }
                }
                // no extended subconcepts found return
                return undefined;
            }

            // if there are no subconcepts return
            return undefined;
        }
    }

    /**
     * Returns true if the a study session question can be created from the concept
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    canMakeQuestion(concept: ConceptStateful) : boolean{
        if (MultipleChoiceQuestionBuilder.isCandiateForMultiChoiceDefinitionQuestion(concept, this.unit)){
            return true;
        }

        return false;
    }

    /**
     * Sets the next question
     * @param  {ConceptStateful|undefined} concept
     */
    setNextQuestion(concept: ConceptStateful | undefined){
        if (concept){
            this.currentConcept = concept.name;

            if (!this.isConceptDefinitionLearnt(concept)){

                this.currentQuestion = MultipleChoiceQuestionBuilder.makeDefinitionQuestion(concept, this.unit);
            }
        }
    }


    /**
     * Return true if concept has been learnt
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptLearnt(concept: ConceptStateful) : boolean{

        if (!this.ssConceptProgressDictionary[concept.id]){
            return false;
        }

        return this.ssConceptProgressDictionary[concept.id].learnt;
    }

    isConceptDefinitionLearnt(concept: ConceptStateful) : boolean{

        if (!this.ssConceptProgressDictionary[concept.id]){
            return false;
        }

        return this.ssConceptProgressDictionary[concept.id].definitionLearnt;
        
    }
}