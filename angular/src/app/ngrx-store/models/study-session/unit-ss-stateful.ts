import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { isCandiateForMultiChoiceDefinitionQuestion, SSQuestionBuilder } from "src/app/ngrx-store/models/study-session/ss-question-builder";
import { AppState } from "../../app-state";
import { updateConceptProgress, updateCurrentConcept } from "../../reducers/unit-study-session.reducer";
import { LearningState, selectUnitStatelessWithProgress, selectUnitToStudyStateless, SSConceptProgressDictionary, SSConcpetProgress } from "../../unit-study-state";
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

    currentQuestion: MultipleChoiceQuestion;

    



    constructor(public store: Store<AppState>) {


        //use selector to get unit to study
       var $unit = this.store.select(selectUnitStatelessWithProgress);

        // subscribe to cahnges to the obserable to get the unit
       $unit.subscribe(

            {
                next: (unitWithProgress) => {
                    // this will be undefined if the user isn't in study (fix for angular not automatically unsubscribing to store updates when owner component destoryed). also next firing from unknown trigger
                    if (unitWithProgress && !this.unit) {

                        this.unit = new UnitStateful(store);
                        this.unit.copyInStatelessData(unitWithProgress.unit);
                        if(unitWithProgress.unitProgress){
                            /**
                             * ****make unit copy in progress*****
                             */
                        }else{
                            // this is the first time the unit is being studied update the progress from the unit as is
                            this.unit.updateUnitProgress();
                        }
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
            

            // update the current progress
            this.store.dispatch(updateCurrentConcept(aspect.concept.id));
            switch (aspect.aspect) {
                case "definition":
                    aspect.concept.definitionLearningProgress = LearningState.doing;
                    this.currentQuestion = SSQuestionBuilder.makeDefinitionQuestion(aspect.concept, this.unit);
                    break;

                case "subconcepts":

                    aspect.concept.subconceptsLearningProgress = LearningState.doing;

                    // removes recalled subconcepts so they won't be used again to make questions
                    var subconcepts = [...aspect.concept.subconcepts];
                    this.removeReclledSubconcepts(aspect.concept);
                    
                    this.currentQuestion = SSQuestionBuilder.makeMultipleSubsconceptQuestion(aspect.concept, this.unit);
                    // return subconcepts back
                    aspect.concept.subconcepts = subconcepts;
                    break;

                case "subconcept order":
                    aspect.concept.subconceptOrderLearningProgress = LearningState.doing

                    this.currentQuestion = SSQuestionBuilder.makeOrderSubconceptsQuestion(aspect.concept);
                    break;
            }
            // update unit progress as progress has changed
            this.unit.updateUnitProgress();
        }
    }

    /**
     * indicate that user has answered question
     */
    userAnswered() {

        // current aspect
        var aspect = this.sessionQueue[0];

        //user has answered, mark question
        this.currentQuestion.markQuestion();
        // update concept aspect progress based on question result
        this.updateProgressOfAspect(aspect);
        if (this.currentQuestion.right) {
            // update question instruction with positive response
            this.currentQuestion.questionText = "That’s right, great job!";

            // for subconcept relationship question only move forward if the all subconcepts have been recalled
            if (aspect.aspect === "subconcepts" && aspect.concept.subconceptsLearningProgress === LearningState.recalled) {
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

        
    }


    /**
     * Return true if concept has been learnt
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptLearnt(concept: ConceptStateful): boolean {



        return concept.learnt;
    }
    /**
     * Returns true if concept's defintion was recalled
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptDefinitionRecalled(concept: ConceptStateful): boolean {

        return concept.definitionLearningProgress === LearningState.recalled;

    }

    /**
     * Return true if concept subconcepts was completely recalled
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isConceptSubconceptsRecalled(concept: ConceptStateful): boolean {

        return concept.subconceptsLearningProgress === LearningState.recalled;
    }



    /**
     * Returns true if the subconcept was recalled 
     * @param  {ConceptStateful} subconcept 
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isSubconceptLearnt(subconcept: ConceptStateful): boolean {
       
        return subconcept.parentRelationshipRecalled;
    }


    /**
     * Returns true if the concept subconcept order has been learnt
     * @param  {ConceptStateful} concept
     * @returns boolean
     */
    isSubconceptOrderRecalled(concept: ConceptStateful): boolean {
        

        return concept.subconceptOrderLearningProgress === LearningState.recalled;
    }

    /**
     * Removes all subconcepts recalled yet, so they are not used to make subconcept questions
     * @param  {ConceptStateful} concept
     */
    removeReclledSubconcepts(concept: ConceptStateful) {

        concept.subconcepts = concept.subconcepts.filter(subconcept => !this.isSubconceptLearnt(subconcept));
    }

    /**
     * Updates the concept learning progress based on the aspect and question result
     * 
     * @param  {QuestionQueueElement} aspect
     */
    updateProgressOfAspect(aspect: QuestionQueueElement) {
        switch (aspect.aspect) {
            case "definition":
                //create a new concept aspect progress object and set progress
                
                aspect.concept.definitionLearningProgress = this.currentQuestion.right ? LearningState.recalled : LearningState.notRecalled

                //create a new progress object with new definition progress

                break;

            case "subconcepts":
                // only update progress, if the question was right, this punishes guessing for subconcept questions
                if (this.currentQuestion.right) {

                    this.currentQuestion.options.forEach((option: Option) => {

                        // for each subconcept relationship set recalled flag to whether the corresponding option in the question is correct
                        
                        var subconcept = aspect.concept.subconcepts.find((subconcept: ConceptStateful) => subconcept.id === option.conceptID);
                       if(subconcept){
                        subconcept.parentRelationshipRecalled = option.state === "correct";
                       }

                    });

                    // // set subconcept recalled flag depending on whether all subconcepts are succefully recalled else set to still doing
                   
                    aspect.concept.subconceptsLearningProgress = aspect.concept.subconcepts.every((subconcept: ConceptStateful) => subconcept.parentRelationshipRecalled) ? LearningState.recalled : LearningState.doing;
                }else{
                    aspect.concept.subconceptsLearningProgress = LearningState.notRecalled;
                }

                break;

            case "subconcept order":
                
                aspect.concept.subconceptOrderLearningProgress = this.currentQuestion.right ? LearningState.recalled : LearningState.notRecalled; 

        }

        //update progress in store
        this.unit.updateUnitProgress();
    }

}

interface QuestionQueueElement {
    concept: ConceptStateful,
    aspect: "definition" | "subconcepts" | "subconcept order"
}