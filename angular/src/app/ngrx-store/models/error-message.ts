export interface Error {
    title: string;
    message: string
    show: boolean;
    time: string;
    actionType: string;
    id: string;
}

export interface ErrorDictionary {
    [key: string] : Error;
}