import { Concept } from "./models/concept";
import { v1 as timeStampUUID } from 'uuid';


export class ConceptHelper{
    createNewConcept(parent: Concept | undefined): Concept{
        return {
            id : timeStampUUID(),
            name: "",
            parent: parent ,
            hasOrderedSubconcepts: false,
            subconcepts: [],
            definition: "",
            index: 0,
            numberOfSubconceptsWithDefinition: 0,
            numberOfSubConcpetsWithSubconcepts: 0
        };
    }
}