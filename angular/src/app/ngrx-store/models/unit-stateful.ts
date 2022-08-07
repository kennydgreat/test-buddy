import { ConceptStateful } from "./concept-stateful";
import { v1 as timeStampUUID } from 'uuid';
import { UnitStateless } from "./unit-stateless";
import { Store } from "@ngrx/store";
import { AppState } from "../app-state";
import { deleteUnitAction, updateUnit } from "../reducers/unit.reducer";
import { ConceptType, conceptTypes } from "./study-session/concept-criteria";
export class UnitStateful {
    id: string;
    name: string;
    description: string;
    concepts: Array<ConceptStateful>;
    numOfConcepts: number;
    numOfRootConceptsWithDefiniton: number;
    numOfRootConceptsWithSubconcepts: number;
    unitBeforeChanges: UnitStateless;
    toBeDeleted: boolean;


    constructor(public store: Store<AppState> | undefined){
        this.id = timeStampUUID();
        this.name = "";
        this.description = "";
        this.concepts = new Array<ConceptStateful>();
        this.numOfConcepts = 0;
        this.numOfRootConceptsWithDefiniton = 0;
        this.numOfRootConceptsWithSubconcepts = 0;
        this.toBeDeleted = false;

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
            numOfRootConceptsWithDefiniton: 0,
            numOfRootConceptsWithSubconcepts: 0,
            toBeDeleted: this.toBeDeleted,
        };

        // copy concepts
        this.concepts.forEach((concept : ConceptStateful, index: number ) => {

            var conceptStateless = concept.makeStatelessCopy();

            //set the stateless concept index
            conceptStateless.index = index;

            // add to definition concept count
            if (concept.hasDefinition()){
                unitStatlessCopy.numOfRootConceptsWithDefiniton++;
            }

            // add to concepts with sub-concept count
            if (concept.hasSubconcepts()){
                unitStatlessCopy.numOfRootConceptsWithSubconcepts++;
            }
            unitStatlessCopy.concepts.push(conceptStateless);
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
            this.store.dispatch(deleteUnitAction({id: this.id}));
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
     * Returns a certain number of concepts that are adjacent to the concept in the unit's list of concepts
     * @param  {ConceptStateful} concept
     * @param  {number} numberOfConceptsNeeded
     * @param  {ConceptType} creteria
     * @returns ConceptStateful
     */
    getAdjacentConcepts(concept: ConceptStateful, numberOfConceptsNeeded: number, creteria: ConceptType): ConceptStateful[] {
        if (!this.concepts.includes(concept) || numberOfConceptsNeeded <= 0 || this.concepts.length <= 1) {
          return [];
        }
    
        const adjecentConcepts = [];
        if (numberOfConceptsNeeded > this.concepts.length - 1) {
          // number of concepts needed is more thant the total number of others concepts, make the numberOfConceptsneeded the total number of other concepts
          numberOfConceptsNeeded = this.concepts.length - 1;
        }
    
        // slipt the number of concepts needed into 2
    
        let rightSideConceptsNeeded;
        let leftSideConceptsNeeded;
    
        if (concept.index === 0) {
          // the concept is the first concept so get concepts from the right side only
          rightSideConceptsNeeded = numberOfConceptsNeeded;
          leftSideConceptsNeeded = 0;
        } else {
          rightSideConceptsNeeded = numberOfConceptsNeeded % 2 ===
            0 ? numberOfConceptsNeeded / 2 : Math.floor(numberOfConceptsNeeded / 2 + 1);
          leftSideConceptsNeeded = Math.floor(numberOfConceptsNeeded / 2);
        }
    
        // start with right side
        let currentConceptIndex = concept.index + 1;
        while (rightSideConceptsNeeded > 0 && currentConceptIndex < this.concepts.length) {
          switch (creteria) {
            case conceptTypes.hasDefinition:
              if (currentConceptIndex !== concept.index && this.concepts[currentConceptIndex].hasDefinition()) {
                adjecentConcepts.push(this.concepts[currentConceptIndex]);
                rightSideConceptsNeeded--;
              }
              break;
            case conceptTypes.hasSubconcepts:
              if (currentConceptIndex !== concept.index && this.concepts[currentConceptIndex].hasSubconcepts()) {
                adjecentConcepts.push(this.concepts[currentConceptIndex]);
                rightSideConceptsNeeded--;
              }
              break;
            case conceptTypes.none:
              if (currentConceptIndex !== concept.index) {
                adjecentConcepts.push(this.concepts[currentConceptIndex]);
                rightSideConceptsNeeded--;
              }
          }
          currentConceptIndex++;
        }
    
        // adding the rightSide concepts needed to the left for the case that the current index reached the end of the concepts array before rightside is 0
        leftSideConceptsNeeded = leftSideConceptsNeeded + rightSideConceptsNeeded;
    
        // starting the current index on the left
        currentConceptIndex = concept.index - 1;
    
        // left side
        while (leftSideConceptsNeeded > 0 && currentConceptIndex >= 0) {
          switch (creteria) {
            case conceptTypes.hasDefinition:
              if (currentConceptIndex !== concept.index && this.concepts[currentConceptIndex].hasDefinition()) {
                adjecentConcepts.push(this.concepts[currentConceptIndex]);
                leftSideConceptsNeeded--;
              }
              break;
            case conceptTypes.hasSubconcepts:
              if (currentConceptIndex !== concept.index && this.concepts[currentConceptIndex].hasSubconcepts()) {
                adjecentConcepts.push(this.concepts[currentConceptIndex]);
              }
              break;
            case conceptTypes.none:
              if (currentConceptIndex !== concept.index) {
                adjecentConcepts.push(this.concepts[currentConceptIndex]);
                leftSideConceptsNeeded--;
              }
          }
          currentConceptIndex--;
        }
        return adjecentConcepts;
      }

    /**
     * copies data from a stateless concept
     * @param  {UnitStateless} unit
     */
    copyInStatelessData(unit: UnitStateless){
        // set unit before changes to this unit is before, this to discard the changes.
        this.unitBeforeChanges = unit;
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
    /**
     * Undoes changes to the unit
     */
    deleteChanges(){
        this.store.dispatch(updateUnit(this.unitBeforeChanges));
    }

    /**
     * Deletes a concept from the unit''
     * @param  {ConceptStateful} concept the concept to delete
     */
    deleteConcept(concept: ConceptStateful){

        concept.deleteSubconcepts()
        let parent = concept.parent;
        
       if (parent === undefined) {
            //this concept isn't part of a tree so it is a root in the unit's concept list and needs to be deleted
            this.concepts = this.concepts.filter(currrentConcept => (currrentConcept !== concept))
        }
        else{

            // the concept as a parent so need from the parent
            parent.subconcepts = parent.subconcepts.filter(currrentConcept => (currrentConcept !== concept));
        }

        this.updateUnitInStore();
    }
    
  }