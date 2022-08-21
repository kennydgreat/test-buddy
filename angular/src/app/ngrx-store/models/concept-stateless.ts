import { ConceptType } from "./study-session/concept-criteria";

export interface ConceptStateless {
    id: string;
    name: string;
    parent: ConceptStateless | undefined;
    hasOrderedSubconcepts: boolean
    subconcepts: Array<ConceptStateless>;
    definition: string
    index: number;
    numberOfSubconceptsWithDefinition: number;
    numberOfSubConcpetsWithSubconcepts: number;
    type: ConceptType
}