import { ConceptStateful } from "./concept-stateful";
import { v1 as timeStampUUID } from 'uuid';
export class UnitStateful {
    id: string;
    name: string;
    description: string;
    concepts: Array<ConceptStateful>;
    numOfConcepts: number;
    numOfRootConceptsWithDefiniton: number;
    numOfRootConceptsWithSubconcepts: number;

    constructor(){
        this.id = timeStampUUID();
        this.name = "";
        this.description = "";
        this.concepts = new Array<ConceptStateful>();
        this.numOfConcepts = 0;
        this.numOfRootConceptsWithDefiniton = 0;
        this.numOfRootConceptsWithSubconcepts = 0;

    }
    /**
     * adds a concept to the concept
     */
    addNewRootConcept(){
        this.concepts.push(new ConceptStateful());
        this.numOfConcepts = this.concepts.length;
    }

    /**
     * check if the unit does not have any meanful information
     * @returns boolean
     */
    isEmpty(): boolean {
        if (this.hasName() || this.hasDescription()){
            return false;
        }

        // check the concepts
        for (var i = 0; i < this.concepts.length; i++){
            if (!this.concepts[i].isConceptEmpty()){
                // the current concept is not empty so the unit is not empty
                return false;
            }
        }
        return true;
    }
    
    /**
     * checks that the unit has a name
     * @returns boolean
     */
    hasName(): boolean {
        return this.name.length > 0;
    }

    /**
     * checks that the unit has a description
     * @returns boolean
     */
    hasDescription(): boolean{
        return this.description.length > 0;
    }
  }