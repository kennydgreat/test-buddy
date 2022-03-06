export interface Error {
    textError: string;
    show: boolean;
    time: string;
    actionType: string;
}

export interface ErrorDictionary {
    [key: string] : Error;
}