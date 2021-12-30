
export interface Concept {
    id: string;
    name: string;
    parent: Concept | undefined;
    hasOrderedSubconcepts: boolean
    subconcepts: Array<Concept>;
    definition: string
    index: number;
    numberOfSubconceptsWithDefinition: number;
    numberOfSubConcpetsWithSubconcepts: number ;
}