import { ConceptStateful } from "../ngrx-store/models/concept-stateful";
import { conceptTypes } from "../ngrx-store/models/study-session/concept-criteria";
import { Option } from "../ngrx-store/models/study-session/multiple-choice-option";
import { MultipleChoiceQuestion } from "../ngrx-store/models/study-session/multiple-choice-question";
import { UnitStateful } from "../ngrx-store/models/unit-stateful";

 /**
* Check if a multiple choice definition question can be made for this concept
* @param  {ConceptStateful} concept the concept
* @param  {UnitStateful} unit the concept's unit
* @returns boolean
*/
export function isCandiateForMultiChoiceDefinitionQuestion(concept: ConceptStateful, unit: UnitStateful): boolean {
   if (concept.hasDefinition()) {
     if (concept.numberOfSubconceptsWithDefinition > 1) {
       return true;
     }
     if (concept.getNumberOfSlibingsWithDefinition() > 1) {
       return true;
     }
     if (unit.numOfRootConceptsWithDefiniton > 1) {
       return true;
     }

     return concept.numberOfSubconceptsWithDefinition > 0 &&
       (concept.getNumberOfSlibingsWithDefinition() > 0 || concept.parentHasDefinition()) &&
       unit.numOfRootConceptsWithDefiniton > 0 || unit.numOfRootConceptsWithSubconcepts > 0;
   }
   return false;
 }
 /**
  * Makes a study session that test recollection of a concept's defintion 
  * @param  {ConceptStateful} concept
  * @param  {UnitStateful} unit
  * @returns MultipleChoiceQuestion
  */
 export function makeSSDefinitionQuestion(concept: ConceptStateful, unit: UnitStateful): MultipleChoiceQuestion | undefined {
  if (unit.numOfConcepts <= 1) {
    return undefined;
  }

  // setting the number of options needed
  var numberOfOptions = 4;
  // concepts that will represent wrong options for the question
  let wrongOptionConcepts = new Array<ConceptStateful>();

  // try to use the concept's siblings with definition for wrong options
  if (concept.hasSlibingsWithDefinition()) {
    wrongOptionConcepts = concept.getSiblingWithDefinition(numberOfOptions - 1);
  }

  if (wrongOptionConcepts.length < numberOfOptions - 1 && concept.hasSubconceptsWithDefinition()) {
    // there is not enough options yet so try using the concept's children
    const children = concept.getSubconceptWithDefinition(numberOfOptions - 1);
    children.forEach((concept) => {
      wrongOptionConcepts.push(concept);
    });
  }

  if (concept.parent && concept.parentHasDefinition() && wrongOptionConcepts.length < numberOfOptions - 1) {
    // there is still not ehough options yet so try using the parent.
    wrongOptionConcepts.push(concept.parent);
  }

  if (wrongOptionConcepts.length < numberOfOptions - 1) {
    // this is still not enough options so try using the adjacent concepts of the concept's root
    let adjecentConcepts = [];
    const rootconcept = concept.getRoot();
    adjecentConcepts = unit.getAdjacentConcepts(rootconcept, (numberOfOptions - 1) - wrongOptionConcepts.length, conceptTypes.hasDefinition);
    adjecentConcepts.forEach((concept) => {
      wrongOptionConcepts.push(concept);
    });
  }

  // try using the subsconcepts of root adjacent concepts
  if (wrongOptionConcepts.length < numberOfOptions - 1) {
    var adjecentConcepts = [];
    const rootConcept = concept.getRoot();
    adjecentConcepts = unit.getAdjacentConcepts(rootConcept,  (numberOfOptions - 1) - wrongOptionConcepts.length, conceptTypes.hasSubconcepts);
    adjecentConcepts.forEach((concept : ConceptStateful) => {
      // only add subconcepts from adjecentConcepts that don't have ordered subconcepts, this way only informational concepts are added rather than timeline or procedural concepts
      if (!concept.hasOrderedSubconcepts) {
        wrongOptionConcepts = [...wrongOptionConcepts, ...concept.getConceptInformation()];
      }
    });
  }

  if (wrongOptionConcepts.length <= 0) {
    return undefined;
  }

  // shuffle the concepts order
  wrongOptionConcepts = shuffleArray(wrongOptionConcepts);
  if (wrongOptionConcepts.length + 1 < numberOfOptions) {
    // the number of options avaliable is less than 4
    numberOfOptions = wrongOptionConcepts.length + 1;
  }

  // making Question objecr
  const rightOptionPosition = getRandomInt(numberOfOptions - 1);
  const options = new Array<Option>();
  for (var i = 0; i < numberOfOptions; i++) {
    if (i === rightOptionPosition) {
      options.push(new Option(concept.definition, true));
    } else {
      const wrongConcept = wrongOptionConcepts.shift();
      if (wrongConcept !== undefined) {
        if (wrongConcept.hasDefinition()){
          options.push(new Option(wrongConcept.definition, false));
        }else{
          // the concept does not have a definition so it's not concept it's information
          options.push(new Option(wrongConcept.name, false));
        }
      }
    }
  }
  return new MultipleChoiceQuestion(`Choose the right definition for "${concept.name}"`, options, false);
}



 export const MultipleChoiceQuestionBuilder = {
    isCandiateForMultiChoiceDefinitionQuestion,
    makeDefinitionQuestion: makeSSDefinitionQuestion
 }

const shuffleArray = (array: any[]) : any[] => {
  let currentIndex = array.length; let temporaryValue; let randomIndex;

  // while there remain elements to shuffle...
  while (0 !== currentIndex) {
    // pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};


const getRandomInt = (max: number) : number=> {
  max++; // this makes the return value from 0 to max inclusively
  return Math.floor(Math.random() * Math.floor(max));
};


const getRandomIntNoneZero = (max: number) : number => {
  const number = getRandomInt(max);
  if (number === 0) {
    return 1;
  }
  return number;
};
