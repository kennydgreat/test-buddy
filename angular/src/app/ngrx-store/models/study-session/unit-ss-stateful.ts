import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { isCandiateForMultiChoiceDefinitionQuestion, SSQuestionBuilder } from "src/app/ngrx-store/models/study-session/ss-question-builder";
import { AppState } from "../../app-state";
import { selectUnitToStudyStateless, SSConceptProgressDictionary, SSConcpetProgress } from "../../unit-study-state";
import { ConceptStateful } from "../concept-stateful";
import { UnitStateful } from "../unit-stateful";
import { UnitStateless } from "../unit-stateless";
import { Option } from "./multiple-choice-option";
import { MultipleChoiceQuestion } from "./multiple-choice-question";

/**
 * Represents the stateful version of a unit study session data and concepts the logic for a study session
 */
export class UnitSS_Stateful {

    unit: UnitStateful;
    unitID: string
    unitNameForStudySession: string;
    currentConcept: string;
    sessionQueue: Array<QuestionQueueElement>; // the order of concept and aspects to show user
    ssConceptProgressDictionary: SSConceptProgressDictionary;
    currentQuestion: MultipleChoiceQuestion;
    $unit: Observable<UnitStateless>;
    currentConceptAspect: "definition" | "subconcepts" | "subconcept order"



    constructor(public store: Store<AppState>) {

        this.ssConceptProgressDictionary = {};

        //use selector to get unit to study
        this.$unit = this.store.select(selectUnitToStudyStateless);

        // subscribe to cahnges to the obserable to get the unit
        this.$unit.subscribe(

            {
                next: (unitFromStore: UnitStateless) => {
                    // this will be undefined if the user isn't in study (fix for angular not automatically unsubscribing to store updates when owner component destoryed). also next firing from unknown trigger
                    if (unitFromStore && !this.unit) {

                        this.unit = new UnitStateful(store);
                        this.unit.copyInStatelessData(unitFromStore);
                        this.unitNameForStudySession = this.unit.name
                        this.unitID = this.unit.id;
                        this.setSSQueueFromUnit();
                        this.setNextQuestion();

                    }
                }




            }
        );

    }


    /**
     * Creates a queue of concept and aspects for the session
     */
    setSSQueueFromUnit() {
        this.sessionQueue = new Array<QuestionQueueElement>();
        this.unit.concepts.forEach((concept: ConceptStateful) => {
            this.addConceptTreeToQueue(concept);
        });
    }


    /**
     * Adds the tree of concepts to the session's queue
     */
    addConceptTreeToQueue(concept: ConceptStateful) {

        if (!this.ssConceptProgressDictionary[concept.id]) {
            this.createProgressForConcept(concept);
        }

        if (this.canMakeQuestion(concept)) {
            if (SSQuestionBuilder.isCandiateForMultiChoiceDefinitionQuestion(concept, this.unit)) {
                this.sessionQueue.push({
                    concept: concept,
                    aspect: "definition",
                });
            }

            if (SSQuestionBuilder.isCandiateForMultipleSubconceptQuestion(concept, this.unit)) {
                this.sessionQueue.push({
                    concept: concept,
                    aspect: "subconcepts",
                });
            }

            if (SSQuestionBuilder.isCanadiateForOrderSubconceptsQuestion(concept)) {
                this.sessionQueue.push({
                    concept: concept,
                    aspect: "subconcept order",
                });
            }

            if (concept.hasSubconcepts()) {
                concept.subconcepts.forEach((subconcept: ConceptStateful) => {
                    this.addConceptTreeToQueue(subconcept);
                });
            }
        }
    }

    /**
     * Progress the session on to the next question
     */
    userReadyForNextQuestion() {
        this.setNextQuestion();
    }


    /**
     * Create a progress object for concept
     * @param  {ConceptStateful} concept
     */
    createProgressForConcept(concept: ConceptStateful) {
        this.ssConceptProgressDictionary[concept.id] = {
            id: concept.id,
            name: concept.name,
            learnt: false,
            definition: concept.hasDefinition() ? false : undefined,
            subconceptRelationship: concept.hasSubconcepts() ? {
                recalled: false,
                progress: {}
            } : undefined,
            subconceptOrder: concept.hasOrderedSubconcepts ? false : undefined,
        };

        if (concept.hasSubconcepts()) {
            concept.subconcepts.forEach((subconcept: ConceptStateful) => {

                this.ssConceptProgressDictionary[concept.id].subconceptRelationship.progress[subconcept.id] = {
                    subconceptId: subconcept.id,
                    relationshipRecalled: false
                }
            });
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
     * Sets the next question based on the current aspect and concept
     */
    setNextQuestion() {
        // get the first aspect and concept in the queue
        var aspect = this.sessionQueue[0];
        if (aspect) {
            this.currentConcept = aspect.concept.name;
            switch (aspect.aspect) {
                case "definition":
                    this.currentQuestion = SSQuestionBuilder.makeDefinitionQuestion(aspect.concept, this.unit);
                    break;

                case "subconcepts":
                    // removes recalled subconcepts so they won't be used again to make questions
                    this.removeReclledSubconcepts(aspect.concept);
                    this.currentQuestion = SSQuestionBuilder.makeMultipleSubsconceptQuestion(aspect.concept, this.unit);
                    break;

                case "subconcept order":
                    this.currentQuestion = SSQuestionBuilder.makeOrderSubconceptsQuestion(aspect.concept);
                    break;
            }
        }
    }

    /**
     * indicate that user has answered question
     */
    userAnswered() {

        // pop aspect from queue, so the next aspect can used next time around
        var aspect = this.sessionQueue[0];

        //user has answered, mark question
        this.currentQuestion.markQuestion();
        // update con
        this.updateProgressOfAspect(aspect);
        if (this.currentQuestion.right) {
            // update question instruction with positive response
            this.currentQuestion.questionText = "That’s right, great job!";

            // for subconcept relationship question only move forward if the all subconcepts have been recalled
            if (aspect.aspect === "subconcepts" && this.ssConceptProgressDictionary[aspect.concept.id].subconceptRelationship.recalled) {
                this.sessionQueue.shift();
            }

            // for all other aspects move forward 
            if (aspect.aspect === "definition" || aspect.aspect === "subconcept order") {
                this.sessionQueue.shift();
            }


        } else {
            // update question instruction with supportive response
            this.currentQuestion.questionText = "Here's how you did. Don't worry you'll get another chance to get it right later in the session.";

            //move forward
            this.sessionQueue.shift();
            // add aspect to the end of the queue so the aspect can be attempted again
            this.sessionQueue.push(aspect);

        }

        // update con
        this.updateProgressOfAspect(aspect);
    }


    /**
     * Return true if concept has been learnt
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptLearnt(aspect: ConceptStateful): boolean {

        if (!this.ssConceptProgressDictionary[aspect.id]) {
            return false;
        }



        return this.ssConceptProgressDictionary[aspect.id].learnt;
    }
    /**
     * Returns true if concept's defintion was recalled
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptDefinitionRecalled(aspect: ConceptStateful): boolean {

        if (!this.ssConceptProgressDictionary[aspect.id]) {
            return false;
        }

        return this.ssConceptProgressDictionary[aspect.id].definition;

    }

    /**
     * Return true if concept subconcepts was completely recalled
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptSubconceptsRecalled(aspect: ConceptStateful): boolean {

        if (!this.ssConceptProgressDictionary[aspect.id]) {
            return false;
        }
        return this.ssConceptProgressDictionary[aspect.id].subconceptRelationship.recalled;
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
        if (!this.ssConceptProgressDictionary[concept.id].subconceptRelationship.progress[subconcept.id]) {
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

    /**
     * Updates the concept learning progress based on the aspect 
     * 
     * @param  {QuestionQueueElement} aspect
     */
    updateProgressOfAspect(aspect: QuestionQueueElement) {
        switch (aspect.aspect) {
            case "definition":
                this.ssConceptProgressDictionary[aspect.concept.id].definition = this.currentQuestion.right;
                break;

            case "subconcepts":
                // only update progress, if the question was right, this punishes guessing
                if (this.currentQuestion.right) {

                    this.currentQuestion.options.forEach((option: Option) => {

                        // for each subconcept relationship set recalled flag to whether the corresponding option in the question is correct
                        if (this.ssConceptProgressDictionary[aspect.concept.id].subconceptRelationship.progress[option.conceptID]) {
                            this.ssConceptProgressDictionary[aspect.concept.id].subconceptRelationship.progress[option.conceptID].relationshipRecalled = option.state === "correct";
                        }

                    });

                    // set subconcept recalled flag to  whether all subconcepts are succefulyl recalled
                    this.ssConceptProgressDictionary[aspect.concept.id].subconceptRelationship.recalled = Object.values(this.ssConceptProgressDictionary[aspect.concept.id].subconceptRelationship.progress).every((progress) => progress.relationshipRecalled);
                }

                break;

            case "subconcept order":
                this.ssConceptProgressDictionary[aspect.concept.id].subconceptOrder = this.currentQuestion.right;

        }
    }

}

interface QuestionQueueElement {
    concept: ConceptStateful,
    aspect: "definition" | "subconcepts" | "subconcept order"
}