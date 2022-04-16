import { ConceptStateless } from "./models/concept-stateless";
import { v1 as timeStampUUID } from 'uuid';


export class ConceptHelper{
    createNewConcept(parent: ConceptStateless | undefined): ConceptStateless{
        return {
            id : timeStampUUID(),
            name: "Testing this thing baby come on",
            parent: parent ,
            hasOrderedSubconcepts: false,
            subconcepts: [],
            definition: "",
            index: 0,
            numberOfSubconceptsWithDefinition: 0,
            numberOfSubConcpetsWithSubconcepts: 0
        };
    }
    // determines if a concept holds no data
    isConceptEmpty(concept: ConceptStateless): boolean{
        // check that the name and definition
        if (concept.name.length > 0 || concept.definition.length > 0){
            //either or both not empty
            return false;
        }
        // check the concept's subconcepts
        for(var i = 0; i < concept.subconcepts.length; i++){
            if (!this.isConceptEmpty(concept.subconcepts[i])){
                // the current is not empty so the parent concept is not empty
                return false; 
            }
        }

       return true;
    }
}