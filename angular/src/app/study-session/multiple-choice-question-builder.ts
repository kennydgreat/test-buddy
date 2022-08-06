import { ConceptStateful } from "../ngrx-store/models/concept-stateful";
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
       unit.numOfRootConceptsWithDefiniton > 0;
   }
   return false;
 }

 export const MultipleChoiceQuestionBuilder = {
    isCandiateForMultiChoiceDefinitionQuestion
 }