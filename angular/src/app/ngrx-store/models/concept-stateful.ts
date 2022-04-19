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
        var subconcept = new ConceptStateful(this.parent);
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

}