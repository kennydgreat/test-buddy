export const conceptTypes = {
  hasDefinition: "hasDefintion" as ConceptType, // a concept with definition, mostly likely a one word concept
  hasSubconcepts: "hasSubconcepts" as ConceptType, // a concept without a definition and with subconcepts, most like a phrase or sentence or even a paragraph 
  hasOrderedSubconcepts: "hasOrderedConcepts" as ConceptType, // a concept with ordered subconcepts, most likely a series of steps
  none: "none" as ConceptType, // unknown type, most likely a concept without information

};

export type ConceptType = "hasDefintion" | "hasSubconcepts" | "hasOrderedConcepts" | "none";