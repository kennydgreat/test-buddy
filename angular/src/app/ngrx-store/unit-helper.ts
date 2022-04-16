import { UnitStateless } from "./models/unit-stateless";

import { ConceptHelper } from "./concept-helper";
import { ConceptStateless } from "./models/concept-stateless";

// Object that holds unit specific business functions
export class UnitHelper {
    concept: ConceptHelper = new ConceptHelper();
    createNewUnit(): UnitStateless {
        // create unit with a unique id
        const id: string = timeStampUUID();
        return  {
            id: id,
            name: "",
            description: "",
            concepts: [],
            numOfConcepts: 0,
            numOfRootConceptsWithDefiniton: 0,
            numOfRootConceptsWithSubconcepts: 0
        };
    }

    createNewRootConcept(): ConceptStateless {
        return this.concept.createNewConcept(undefined);
    }

    // Adds a new root conept to unt by creating a new unit, adding the concept and returning the new unit
    addNewRootConcept(unit: UnitStateless): UnitStateless {
        var newUnit = { ...unit };
        // add new root concept
        newUnit.concepts = [...newUnit.concepts, this.createNewRootConcept()]
            ;
            newUnit.numOfConcepts++;
        return newUnit;
    }


    //check if the unit has no data
    isUnitEmtpy(unit: UnitStateless): boolean {
        // the unit's name and description
        if (unit.name.length > 0 || unit.description.length > 0) {
            //either or both not empty
            return false;
        }

        //check the root concepts
        for (var i = 0; i < unit.concepts.length; i++){
            if (!this.concept.isConceptEmpty(unit.concepts[i])){
                // the current is not empty so the unit is not empty
                return false;
            }
        }

            return true;

    }
}