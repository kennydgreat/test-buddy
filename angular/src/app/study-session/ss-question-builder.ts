import { ConceptStateful } from "../concept-viewer/concept-stateful";
import { ConceptType, conceptTypes } from "../ngrx-store/models/study-session/concept-criteria";
import { Option } from "../ngrx-store/models/study-session/multiple-choice-option";
import { MultipleChoiceQuestion } from "../ngrx-store/models/study-session/multiple-choice-question";
import { UnitStateful } from "../unit-viewer/unit-stateful";


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
    wrongOptionConcepts = concept.getSlibings(numberOfOptions - 1, conceptTypes.hasDefinition);
  }

  if (wrongOptionConcepts.length < numberOfOptions - 1 && concept.hasSubconceptsWithDefinition()) {
    // there is not enough options yet so try using the concept's children
    const children = concept.getSubconcepts(numberOfOptions - 1, conceptTypes.hasDefinition);
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
    adjecentConcepts = unit.getAdjacentConcepts(rootConcept, (numberOfOptions - 1) - wrongOptionConcepts.length, conceptTypes.hasSubconcepts);
    adjecentConcepts.forEach((concept: ConceptStateful) => {
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
        if (wrongConcept.hasDefinition()) {
          options.push(new Option(wrongConcept.definition, false));
        } else {
          // the concept does not have a definition so it's not concept it's information
          options.push(new Option(wrongConcept.name, false));
        }
      }
    }
  }
  return new MultipleChoiceQuestion(`Choose the right definition for "${concept.name}"`, options, "single answer");
}


/**
 * Makes a multi-anwser question to test concept and subconcept relationship
 * @param  {ConceptStateful} concept
 * @param  {UnitStateful} unit
 * @returns MultipleChoiceQuestion
 */
function makeMultipleSubsconceptQuestion(concept: ConceptStateful, unit: UnitStateful): MultipleChoiceQuestion | undefined {


  if (unit.numOfConcepts <= 1 || concept.subconcepts.length < 1) {
    return undefined;
  }

  // subconcept type
  const subconceptsType = concept.getSubconceptsDominateType();
  // setting the number of options needed
  var numberOfOptions = 4;

  // subconcepts to be chosen, get all types
  var subconcepts = concept.getSubconcepts(numberOfOptions, conceptTypes.none);

  // subconcepts that represents wrong options
  var wrongOptionConcepts = new Array<ConceptStateful>();

  // try using sliblings' subconcepts as wrong options
  if (concept.hasSiblings()) {
    const siblings = concept.getSlibings(numberOfOptions, conceptTypes.hasSubconcepts);
    siblings.forEach((sibling: ConceptStateful) => {
      // only add subconcepts from sliblings that don't have ordered subconcepts
      if (!sibling.hasOrderedSubconcepts) {
        wrongOptionConcepts = [...wrongOptionConcepts, ...sibling.subconcepts];
      }
    });
  }


  // try using the random concepts from unit with type
  if (wrongOptionConcepts.length < numberOfOptions) {
    var concepts = [];
    const rootConcept = concept.getRoot();
    concepts = unit.getConcepts(subconceptsType);
    wrongOptionConcepts = [...wrongOptionConcepts, ...concepts];

    // remove concept and subconcepts if in list
    wrongOptionConcepts = wrongOptionConcepts.filter((curCurrent => curCurrent.id !== concept.id && !concept.subconcepts.includes(curCurrent)));

    // scrumble array to randomize concepts used
    wrongOptionConcepts = shuffleArray(wrongOptionConcepts);
  }


  // use a random number of wrong option concepts
  wrongOptionConcepts = wrongOptionConcepts.slice(0, getRandomInt(4));

  // remove excess number of subconcept for right options
  subconcepts = subconcepts.slice(0, 4 - wrongOptionConcepts.length);

  // create wrong options for wrong concepts
  var wrongOptions = new Array<Option>();
  wrongOptionConcepts.forEach((concept: ConceptStateful) => {
    wrongOptions.push(new Option(concept.name, false));
  });

  // create right options from subconcepts
  var rightOptions = new Array<Option>();
  subconcepts.forEach((concept: ConceptStateful) => {
    // id is added for when concept is successfully recalled
    rightOptions.push(new Option(concept.name, true, concept.id));
  });
  // put together options
  var options = [...wrongOptions, ...rightOptions];
  // shuffle options
  options = shuffleArray(options);

  const questionText = `Choose all options that are "${concept.name}" or choose none.`;
  return new MultipleChoiceQuestion(questionText, options, "multi-answer");
}


export function makeOrderSubconceptsQuestion(concept: ConceptStateful): MultipleChoiceQuestion | undefined {
  if (!isCanadiateForOrderSubconceptsQuestion(concept)) {
    return undefined;
  }

  // create options from concept's subconcepts
  var options = new Array<Option>();

  concept.subconcepts.forEach((subconcept: ConceptStateful, index: number) => {
    options.push(new Option(subconcept.name, undefined, undefined, index));
  });

  // shuffle the options
  options = shuffleArray(options);

  const questionText = `Move the cards into the right order for "${concept.name}"`

  return new MultipleChoiceQuestion(questionText, options, "ordered question");
}


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
    if (concept.getNumberOfSlibings(conceptTypes.hasDefinition) > 1) {
      return true;
    }
    if (unit.numOfRootConceptsWithDefiniton > 1) {
      return true;
    }

    return concept.numberOfSubconceptsWithDefinition > 0 &&
      (concept.getNumberOfSlibings(conceptTypes.hasDefinition) > 0 || concept.parentHasDefinition()) &&
      unit.numOfRootConceptsWithDefiniton > 0 || unit.numOfRootConceptsWithSubconcepts > 0;
  }
  return false;
}

/**
 * Returns true if concept is a candiate for a choose subconcepts question
 * @param  {ConceptStateful} concept
 * @param  {UnitStateful} unit
 * @returns boolean
 */
export function isCandiateForMultipleSubconceptQuestion(concept: ConceptStateful, unit: UnitStateful): boolean {
  // concepts with order subconcepts are excluded
  if (concept.hasOrderedSubconcepts) {
    return false;
  }
  // the concepts has to have subconcepts
  if (concept.hasSubconceptsWithInformation()) {
    // with at least 2 slibings there is a enough to make a question
    if (concept.getNumberOfSlibings(conceptTypes.hasSubconcepts) > 1) {
      return true;
    }
    // with at least 2 root concepts there is enough to make a queston
    if (unit.numOfRootConceptsWithSubconcepts > 1) {
      return true;
    }

    return concept.getNumberOfSlibings(conceptTypes.hasSubconcepts) > 0 && unit.numOfRootConceptsWithSubconcepts > 0;
  }
  return false;
}

/**
 * Returns true if concept is a candiate for an order subconcept question
 * @param  {ConceptStateful} concept
 * @returns boolean
 */
export function isCanadiateForOrderSubconceptsQuestion(concept: ConceptStateful): boolean {

  return concept.hasOrderedSubconcepts && concept.hasSubconceptsWithInformation();
}

export const SSQuestionBuilder = {
  isCandiateForMultiChoiceDefinitionQuestion,
  isCandiateForMultipleSubconceptQuestion,
  isCanadiateForOrderSubconceptsQuestion,
  makeDefinitionQuestion: makeSSDefinitionQuestion,
  makeMultipleSubsconceptQuestion,
  makeOrderSubconceptsQuestion,

}

const shuffleArray = (array: any[]): any[] => {
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

/**
 * That a random number from 0 to max
 * @param max 
 * @returns 
 */
const getRandomInt = (max: number): number => {
  max++; // this makes the return value from 0 to max inclusively
  return Math.floor(Math.random() * Math.floor(max));
};


const getRandomIntNoneZero = (max: number): number => {
  const number = getRandomInt(max);
  if (number === 0) {
    return 1;
  }
  return number;
};
