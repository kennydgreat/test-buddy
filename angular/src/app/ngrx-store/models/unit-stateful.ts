import { ConceptStateful } from "./concept-stateful";
import { v1 as timeStampUUID } from 'uuid';
import { UnitStateless } from "./unit-stateless";
import { Store } from "@ngrx/store";
import { AppState } from "../app-state";
import { deleteUnit, updateUnit } from "../unit.reducer";
export class UnitStateful {
    id: string;
    name: string;
    description: string;
    concepts: Array<ConceptStateful>;
    numOfConcepts: number;
    numOfRootConceptsWithDefiniton: number;
    numOfRootConceptsWithSubconcepts: number;

    constructor(public store: Store<AppState> | undefined){
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

    /**
     * Make stateless copy of the unit for redux store
     * @returns UnitStateless
     */
    makeStatelessCopy(): UnitStateless{
        // copy over unit data 
        var unitStatlessCopy : UnitStateless = {
            id: this.id,
            name: this.name,
            description: this.description,
            concepts: [],
            numOfConcepts: this.getNumOfExtendedConcepts(),
            numOfRootConceptsWithDefiniton: this.numOfRootConceptsWithDefiniton,
            numOfRootConceptsWithSubconcepts: this.numOfRootConceptsWithSubconcepts
        };

        // copy concepts
        this.concepts.forEach((concept : ConceptStateful, index: number ) => {
            unitStatlessCopy.concepts.push(concept.makeStatelessCopy());
        });
        return unitStatlessCopy;
    }

    
    /**
     * save or update the unit it the redux store
     */
    async updateUnitInStore(){
        // this will save or update the unit
        if (this.store != undefined){
            this.store.dispatch(updateUnit(this.makeStatelessCopy()))
        }
    }
    /**
     * Delete unit in redux store
     */
    deleteUnitInStore(){
        if(this.store != undefined){
            this.store.dispatch(deleteUnit({id: this.id}));
        }
    }

    
    /**
     * Returns number of all extened concepts (concepts with subconcepts)
     * @returns number
     */
    getNumOfExtendedConcepts(): number {
        var numOfConcepts = 0;
        // get the number of extended concept for each root concept
        this.concepts.forEach(concept => {
            
            if (concept.hasSubconcepts()){
                //this concept is tree so add the concepts in the tree
                numOfConcepts = numOfConcepts + concept.countExtendedConcepts();
                
            }else{
                //this isn't a tree, add 1 for the concept
                numOfConcepts++;
            }
          
        });
        return numOfConcepts;
    }
    /**
     * copies data from a stateless concept
     * @param  {UnitStateless} unit
     */
    copyInStatelessData(unit: UnitStateless){
        // copy unit data
        for (var prop in unit){
            this[prop] = unit[prop];
        }

        //clear our concepts set by loop
        this.concepts = [];

        //set subconcepts
        for(var i = 0; i < unit.concepts.length; i++ ){
            // create a new stateful concept
            var concept = new ConceptStateful();
            // copy data 
            concept.copyInStatelessData(unit.concepts[i]);
            // add concept
            this.concepts.push(concept);
        }

    }
  }