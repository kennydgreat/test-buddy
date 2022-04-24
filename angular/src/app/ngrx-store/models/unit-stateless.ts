import { ConceptStateless } from "./concept-stateless";

export interface UnitStateless {
  id: string;
  name: string;
  description: string;
  concepts: Array<ConceptStateless>;
  numOfConcepts: number;
  numOfRootConceptsWithDefiniton: number;
  numOfRootConceptsWithSubconcepts: number;
}