import { Unit } from "./models/unit";
import { v1 as timeStampUUID } from 'uuid';
import { ConceptHelper } from "./concept-helper";
import { Concept } from "./models/concept";

// Object that holds unit specific business functions
export class UnitHelper{
    concept: ConceptHelper = new ConceptHelper();
    createNewUnit() : Unit{
        // create unit with a unique id
    const id :string = timeStampUUID();
        return {
            id: id,
            name: "",
            description: "",
            concepts: [],
            numOfConcepts: 0,
            numOfRootConceptsWithDefiniton: 0,
            numOfRootConceptsWithSubconcepts: 0
        };
    }

    createNewRootConcept(): Concept{
        return this.concept.createNewConcept(undefined);
    }
}