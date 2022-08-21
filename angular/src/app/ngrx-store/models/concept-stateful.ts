import { v1 as timeStampUUID } from 'uuid';
import { ConceptStateless } from './concept-stateless';
import { ConceptType, conceptTypes } from './study-session/concept-criteria';

export class ConceptStateful {
    id: string;
    name: string;
    parent: ConceptStateful;
    hasOrderedSubconcepts: boolean
    subconcepts: Array<ConceptStateful>;
    definition: string;
    index: number;
    numberOfSubconceptsWithDefinition: number;
    numberOfSubConcpetsWithSubconcepts: number;
    type: ConceptType;
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
        this.numberOfSubConcpetsWithSubconcepts = 0;
        this.type = conceptTypes.none;
    }
    /**
     * checks that the concept has meaningful data
     * @returns boolean
     */
    isConceptEmpty(): boolean {
        // check that the name and definition
        if (this.hasDefinition() || this.hasName()) {
            return false;
        }

        // check subconcepts
        for (var i = 0; i < this.subconcepts.length; i++) {
            if (!this.subconcepts[i].isConceptEmpty()) {
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
    makeStatelessCopy(): ConceptStateless {
        var statelessCopy: ConceptStateless = {
            id: this.id,
            name: this.name,
            parent: undefined,
            hasOrderedSubconcepts: this.hasOrderedSubconcepts,
            subconcepts: [],
            definition: this.definition,
            index: 0,
            numberOfSubconceptsWithDefinition: 0,
            numberOfSubConcpetsWithSubconcepts: 0,
            type: conceptTypes.none,
        }

        if (this.hasDefinition()) {
            statelessCopy.type = conceptTypes.hasDefinition;
        } else if (this.hasOrderedSubconcepts) {
            statelessCopy.type = conceptTypes.hasOrderedSubconcepts;
        } else if (this.hasSubconcepts()) {
            statelessCopy.type = conceptTypes.hasSubconcepts
        } else {
            statelessCopy.type = conceptTypes.none;
        }

        this.subconcepts.forEach((concept: ConceptStateful, index: number) => {
            var statelessSubConCopy = concept.makeStatelessCopy();
            //set index
            statelessSubConCopy.index = index;

            // add to sub-concepts with defintion count
            if (concept.hasDefinition()) {
                statelessCopy.numberOfSubconceptsWithDefinition++;
            }

            // add to expend subconcepts count
            if (concept.hasSubconcepts()) {
                statelessCopy.numberOfSubConcpetsWithSubconcepts++;
            }
            statelessCopy.subconcepts.push(statelessSubConCopy);
        });

        return statelessCopy;
    }

    /**
     * Adds a subconcept
     */
    addsubconcept() {
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
     * Returns true if the concept subconcepts have information
     * @returns boolean
     */
    hasSubconceptsWithInformation(): boolean {
        if (this.hasSubconcepts()) {

            for (var i = 0; i < this.subconcepts.length; i++) {
                if (this.subconcepts[i].name.length > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns true if the concept holds information (definition or subconcepts with information) 
     * @returns boolean
     */
    hasInformation(): boolean {
        return this.hasDefinition() || this.hasSubconceptsWithInformation();
    }

    /**
     * Turns true if the concept has a parent
     * @returns boolean
     */
    hasParent(): boolean {
        return this.parent != undefined;
    }

    /**
     * Returns true if there is subconcept that's exteneded
     * @returns boolean
     */
    isSubconceptExtended(): boolean {
        for (var i = 0; i < this.subconcepts.length; i++) {
            if (this.subconcepts[i].isExtended()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Return true if parent has definition
     * @returns boolean
     */
    parentHasDefinition(): boolean {
        if (this.parent === undefined) {
            return false;
        }
        return this.parent?.hasDefinition();
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
     * Get the number of slibings of a certain type
     * @param  {ConceptType} criteria
     * @returns number
     */
    getNumberOfSlibings(criteria: ConceptType): number {
        let number = 0;
        if (this.parent) {
            switch (criteria) {
                case conceptTypes.hasDefinition:
                    number = this.type === criteria ? this.parent.numberOfSubconceptsWithDefinition - 1 : this.numberOfSubconceptsWithDefinition;
                    break;
                case conceptTypes.hasSubconcepts:
                    number = this.type === criteria ? this.parent.numberOfSubConcpetsWithSubconcepts - 1 : this.parent.numberOfSubConcpetsWithSubconcepts;
                    break;
                case conceptTypes.none:
                    this.parent.subconcepts.length - 1;
                    break;
            }
        }
        return number;
    }



    /**
     * Gets a certain number of slibings of a certain type
     * @param  {number} conceptsNeeded
     * @param  {ConceptType} criteria
     * @returns ConceptStateful
     */
    getSlibings(conceptsNeeded: number, criteria: ConceptType): ConceptStateful[] {
        const slibings = new Array<ConceptStateful>();
        if (this.parent === undefined) {
            return slibings;
        }
        let conceptsAdded = 0;
        let i = 0;

        while (i < this.parent.subconcepts.length && conceptsAdded < conceptsNeeded) {
            switch (criteria) {
                case conceptTypes.hasDefinition:
                    if (!this.hasSubconceptsWithDefinition()) {
                        return slibings;
                    }
                    if (this.parent.subconcepts[i].hasDefinition()) {
                        slibings.push(this.parent.subconcepts[i]);
                        conceptsAdded++;
                    }
                    break;
                case conceptTypes.none:
                    slibings.push(this.parent.subconcepts[i]);
                    conceptsAdded++;
                    break;
            }
            i++;
        }
        return slibings;
    }




    /**
     * Returns true if the concept's parent has a concept with a definition that isn't this concept
     * @returns boolean
     */
    hasSlibingsWithDefinition(): boolean {
        if (!this.parent) {
            return false;
        }
        return (this.parent.numberOfSubconceptsWithDefinition > 1);
    }

    /**
     * Returns true if concept is not the only subconcept of concept parent
     * @returns boolean
     */
    hasSiblings(): boolean {
        if (this.parent === undefined) {
            return false;
        }
        return this.parent.subconcepts.length > 1;
    }

    /**
     * Returns true if this concept has sub-concpets with a defintion
     * @returns 
     */
    hasSubconceptsWithDefinition(): boolean {
        return (this.numberOfSubconceptsWithDefinition > 0);
    }

    /**
     * Gets a certain number of subconcept of a  certain type
     * @param  {number} conceptsNeeded
     * @param  {ConceptType} criteria
     * @returns ConceptStateful
     */
    getSubconcepts(conceptsNeeded: number, criteria: ConceptType): ConceptStateful[] {
        const children = new Array<ConceptStateful>();
        if (!this.hasSubconcepts()) {
            return children;
        }
        let conceptsAdded = 0;
        let i = 0;

        while (i < this.subconcepts.length && conceptsAdded < conceptsNeeded) {
            switch (criteria) {
                case conceptTypes.hasDefinition:
                    if (!this.hasSubconceptsWithDefinition()) {
                        return children;
                    }
                    if (this.subconcepts[i].hasDefinition()) {
                        children.push(this.subconcepts[i]);
                        conceptsAdded++;
                    }
                    break;
                case conceptTypes.none:
                    children.push(this.subconcepts[i]);
                    conceptsAdded++;
                    break;
            }
            i++;
        }
        return children;
    }

    /**
     * Returns the dominate type in the subconcepts list
     * @returns ConceptType
     */
    getSubconceptsDominateType(): ConceptType {
        var definitionType, hasSubconcepts, hasOrderedConcepts = 0;

        // go through the subconcepts to update the type counts
        this.subconcepts.forEach((subconcept => {

            switch (subconcept.type) {

                case conceptTypes.hasDefinition:
                    definitionType++;
                    break;

                case conceptTypes.hasSubconcepts:
                    hasSubconcepts++;
                    break;

                case conceptTypes.hasOrderedSubconcepts:
                    hasOrderedConcepts++;
                    break;
            }
        }));

        if (definitionType >= hasSubconcepts) {
            // even in cases where the numbers are the same chose hasDefinition as the type
            return conceptTypes.hasDefinition;
        } else {

            return conceptTypes.hasSubconcepts;
        }
    }

    /**
     * Get subconcepts that have 
     * @returns Array
     */
    getConceptInformation(): Array<ConceptStateful> {
        const concepts = new Array<ConceptStateful>();

        this.subconcepts.forEach((concept: ConceptStateful) => {

            if (concept.name.length > 0) {
                concepts.push(concept);
            }
        });

        return concepts
    }

    /**
     * Get the concept's root concept
     * @returns 
     */
    getRoot(): ConceptStateful {
        if (this.parent === undefined) {
            return this;
        }
        let parent = this.parent;
        while (parent?.parent !== undefined) {
            parent = parent.parent;
        }
        return parent;
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
     * Returns number of concepts with infomation in the concept's tree (include itself)
     * function traverses tree in breath-first order
     * @returns number
     */
    countInformationalConcepts(): number {
        //number of extended concepts
        var numOfExtendedConcepts = 0;

        //queue from which concepts are added to the list
        var queue = new Array<ConceptStateful>()

        queue.push(this)
        while (queue.length > 0) {
            //remove the first element in th queue
            var currentConcept = queue.shift();
            if (currentConcept.hasInformation()) {
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
    copyInStatelessData(concept: ConceptStateless) {
        //copy concept data
        for (var prop in concept) {
            this[prop] = concept[prop];
        }
        // clear out subconcept set
        this.subconcepts = [];

        //set subconcepts
        for (var i = 0; i < concept.subconcepts.length; i++) {
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