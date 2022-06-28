
/**
 * structure representing a unit to be deleted
 */
export interface UnitDeleteItem{
    name: string;
    id: string;
}

/**
 * Dictionary of structures representing units to be deleted
 */
export interface UnitDeleteItemDictionary{
    [key: string] : UnitDeleteItem;
}