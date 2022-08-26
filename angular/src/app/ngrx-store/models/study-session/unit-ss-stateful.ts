import { Store } from "@ngrx/store";
import { SSQuestionBuilder } from "src/app/ngrx-store/models/study-session/ss-question-builder";
import { AppState } from "../../app-state";
import { selectUnitToStudyStateless, SSConceptProgressDictionary } from "../../unit-study-state";
import { ConceptStateful } from "../concept-stateful";
import { UnitStateful } from "../unit-stateful";
import { UnitStateless } from "../unit-stateless";
import { MultipleChoiceQuestion } from "./multiple-choice-question";

/**
 * Represents the stateful version of a unit study session data and concepts the logic for a study session
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
    findNextConceptInUnit(): ConceptStateful | undefined {
        for (var i = 0; i < this.unit.concepts.length; i++) {
            var curConcept = this.findNextConceptTree(this.unit.concepts[i], false);
            if (curConcept) {
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
    canMakeQuestion(concept: ConceptStateful): boolean {
        if (SSQuestionBuilder.isCandiateForMultiChoiceDefinitionQuestion(concept, this.unit)) {
            return true;
        }

        if (SSQuestionBuilder.isCandiateForMultipleSubconceptQuestion(concept, this.unit)) {
            return true;
        }

        if (SSQuestionBuilder.isCanadiateForOrderSubconceptsQuestion(concept)) {
            return true;
        }

        return false;
    }

    /**
     * Sets the next question
     * @param  {ConceptStateful|undefined} concept
     */
    setNextQuestion(concept: ConceptStateful | undefined) {
        if (concept) {
            this.currentConcept = concept.name;

            if (!this.isConceptDefinitionRecalled(concept) && SSQuestionBuilder.isCandiateForMultiChoiceDefinitionQuestion(concept, this.unit)) {

                this.currentQuestion = SSQuestionBuilder.makeDefinitionQuestion(concept, this.unit);
                return;
            }

            if (!this.isConceptSubconceptsRecalled(concept) && SSQuestionBuilder.isCandiateForMultipleSubconceptQuestion(concept, this.unit)) {
                // remove the recalled subconcepts
                this.removeReclledSubconcepts(concept);
                this.currentQuestion = SSQuestionBuilder.makeMultipleSubsconceptQuestion(concept, this.unit);
                return;
            }

            if (!this.isSubconceptOrderRecalled(concept) && SSQuestionBuilder.isCanadiateForOrderSubconceptsQuestion(concept)) {
                this.currentQuestion = SSQuestionBuilder.makeOrderSubconceptsQuestion(concept);
                return;
            }

        }
    }
    /**
     * indicate that user has answered question
     */
    userAnswered() {
        //user has answered, mark question
        this.currentQuestion.markQuestion();
        if (this.currentQuestion.right) {
            // update question instruction with positive response
            this.currentQuestion.questionText = "Well done!";
        } else {
            // update question instruction with supportive response
            this.currentQuestion.questionText = "Here's how you did. Don't worry you'll get another chance to get it right later in the session."
        }
    }


    /**
     * Return true if concept has been learnt
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptLearnt(concept: ConceptStateful): boolean {

        if (!this.ssConceptProgressDictionary[concept.id]) {
            return false;
        }

        return this.ssConceptProgressDictionary[concept.id].learnt;
    }
    /**
     * Returns true if concept's defintion was recalled
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptDefinitionRecalled(concept: ConceptStateful): boolean {

        if (!this.ssConceptProgressDictionary[concept.id]) {
            return false;
        }

        return this.ssConceptProgressDictionary[concept.id].definition;

    }

    /**
     * Return true if concept subconcepts was completely recalled
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptSubconceptsRecalled(concept: ConceptStateful): boolean {

        if (!this.ssConceptProgressDictionary[concept.id]) {
            return false;
        }
        return this.ssConceptProgressDictionary[concept.id].subconceptRelationship.recalled;
    }



    /**
     * Returns true if the subconcept was recalled 
     * @param  {ConceptStateful} subconcept 
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isSubconceptLearnt(subconcept: ConceptStateful, concept: ConceptStateful): boolean {
        if (!this.ssConceptProgressDictionary[concept.id]) {
            return false;
        }

        return this.ssConceptProgressDictionary[concept.id].subconceptRelationship.progress[subconcept.id].relationshipRecalled;
    }


    /**
     * Returns true if the concept subconcept order has been learnt
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isSubconceptOrderRecalled(concept: ConceptStateful): boolean {
        if (!this.ssConceptProgressDictionary[concept.id]) {
            return false;
        }

        return this.ssConceptProgressDictionary[concept.id].subconceptOrder;
    }

    /**
     * Removes all subconcepts recalled yet
     * @param  {ConceptStateful} concept
     */
    removeReclledSubconcepts(concept: ConceptStateful) {

        concept.subconcepts = concept.subconcepts.filter(subconcept => !this.isSubconceptLearnt(subconcept, concept));
    }
}