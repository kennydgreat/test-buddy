export const conceptTypes = {
    hasDefinition: "hasDefintion" as ConceptType,
    hasSubconcepts: "hasSubconcepts" as ConceptType,
    noDefinition: "hasNoDefinition" as ConceptType,
    none: "none" as ConceptType,
  
  };
  
  export type ConceptType = "hasDefintion" | "hasSubconcepts" | "hasNoDefinition" |"none";