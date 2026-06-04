export interface Person {
    id?: string;
    name: string;
    surname : string
    listWeight : { date: string; weight: number }[];
    chambreNumber : string;
    aileName : string;
    listWeightForChart? : any;
}