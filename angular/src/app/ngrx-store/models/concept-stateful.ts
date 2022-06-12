import { v1 as timeStampUUID } from 'uuid';
import { ConceptStateless } from './concept-stateless';

export class ConceptStateful {
    id: string;
    name: string;
    parent: ConceptStateful;
    hasOrderedSubconcepts: boolean
    subconcepts: Array<ConceptStateful>;
    definition: string;
    index: number;
    numberOfSubconceptsWithDefinition: number;
    numberOfSubConcpetsWithSubconcepts: number ;
    /**
     * Creates a new concept
     * @param  {ConceptStateful|undefined=undefined} parent the concept parent, if undefined this is a root concept
     */
    constructor(parent: ConceptStateful | undefined = undefined) {
        this.id = timeStampUUID();
        this.name = "";
        this.subconcepts = new Array<ConceptStateful>();
        this.hasOrderedSubconcepts = false;
        this.definition = "";
        this.parent = parent != undefined ? parent : undefined;
        this.index = 0;
        this.numberOfSubconceptsWithDefinition = 0;
        this,this.numberOfSubConcpetsWithSubconcepts = 0;
    }
    /**
     * checks that the concept has meaningful data
     * @returns boolean
     */
    isConceptEmpty(): boolean{
        // check that the name and definition
        if (this.hasDefinition() || this.hasName()){
            return false;
        }

        // check subconcepts
        for (var i = 0; i < this.subconcepts.length; i++){
            if (!this.subconcepts[i].isConceptEmpty()){
                // the current subconcept is not empty so the unit not empty
                return false;
            }
        }

        return true;
    }
    /**
     * Checks that that the concept name is not empty
     * @returns boolean
     */
    hasName(): boolean {
        if (this.name.length <= 0) {
            return false;
        }
        return true;
    }

    /**
     * Checks that the concept definition is not empty
     * @returns boolean
     */
     hasDefinition(): boolean {
        return this.definition.length > 0
    }
    /**
     * Makes a stateless copy for the redux store
     * @returns ConceptStateless 
     */
    makeStatelessCopy(): ConceptStateless{
        var statelessCopy : ConceptStateless = {
            id: this.id,
            name: this.name,
            parent: undefined,
            hasOrderedSubconcepts: this.hasOrderedSubconcepts,
            subconcepts: [],
            definition: this.definition,
            index: this.index,
            numberOfSubconceptsWithDefinition: this.numberOfSubconceptsWithDefinition,
            numberOfSubConcpetsWithSubconcepts: this.numberOfSubConcpetsWithSubconcepts
        }

        this.subconcepts.forEach((concept: ConceptStateful, index: number) => {
            var statelessSubConCopy = concept.makeStatelessCopy();
            statelessCopy.subconcepts.push(statelessSubConCopy);
        });

        return statelessCopy;
    }

    /**
     * Adds a subconcept
     */
    addsubconcept(){
        var subconcept = new ConceptStateful(this);
        subconcept.index = this.subconcepts.length;
        this.subconcepts.push(subconcept);     
    }

    /**
     * checks that the concept is expanded (has a definition or sub-concepts)
     * @returns boolean
     */
    isExtended(): boolean {
        if (this.hasDefinition()) {
            return true;
        }
        if (this.hasSubconcepts()) {
            return true;
        }
        return false;
    }

    /**
     * Checks that concept has subconcepts
     * @returns boolean
     */
    hasSubconcepts(): boolean {
        return this.subconcepts.length > 0
    }

    /**
     * Turns true if the concept has a parent
     * @returns boolean
     */
    hasParent() : boolean{
        return this.parent != undefined;
    }
    
    /**
     * Returns true if there is subconcept that's exteneded
     * @returns boolean
     */
    isSubconceptExtended() : boolean{
        for(var i = 0; i < this.subconcepts.length; i++){
            if (this.subconcepts[i].isExtended()){
                return true;
            }
        }
        return false;
    }
    /**
     * Delete all subconcepts
     */
    deleteSubconcepts() {
        this.subconcepts.forEach((subconcept, index) => {
            subconcept.deleteSubconcepts()
        })

        //clear children array
        this.subconcepts.length = 0
    }

    
    /**
     * Returns number of extended concepts in the concept's tree (include itself)
     * function traverses tree in breath-first order
     * @returns number
     */
    countExtendedConcepts(): number {
        //number of extended concepts
        var numOfExtendedConcepts = 0;

        //queue from which concepts are added to the list
        var queue = new Array<ConceptStateful>()

        queue.push(this)
        while (queue.length > 0) {
            //remove the first element in th queue
            var currentConcept = queue.shift();
            if (currentConcept.isExtended()) {
                //the concept has subconcepts or a definition so it can added, leaf concepts are treated as information and not actual concepts
                numOfExtendedConcepts++;
            }

            currentConcept.subconcepts.forEach(subconcept => {
                //add the subConcepts to the queue so then can be looked at next time around
                queue.push(subconcept)
            })

        }

        return numOfExtendedConcepts;

    }
    /**
     * Copies data from a stateless concept
     * @param  {ConceptStateless} concept
     */
    copyInStatelessData(concept: ConceptStateless){
        //copy concept data
        for( var prop in concept){
            this[prop] = concept[prop];
        }
        // clear out subconcept set
        this.subconcepts = [];

        //set subconcepts
        for( var i = 0; i < concept.subconcepts.length; i++){
            // create new concept
            var subconcept = new ConceptStateful();
            // set parent 
            subconcept.parent = this;
            // copy data
            subconcept.copyInStatelessData(concept.subconcepts[i]);
            // add subconcept
            this.subconcepts.push(subconcept);
            
        }
    }

}