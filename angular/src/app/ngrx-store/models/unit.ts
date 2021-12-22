import { Concept } from "./concept";

export interface Unit {
  id: string;
  name: string;
  description?: string;
  concepts: Array<Concept>;
  numOfConcepts: number;
  numOfRootConceptsWithDefiniton: number;
  numOfRootConceptsWithSubconcepts: number;
}