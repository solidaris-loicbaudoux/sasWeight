
export interface IPerson {
    id?: string;
    name: string;
    surname : string
    chambreNumber : string;
    aileName : string;
    listWeight : { date: string; weight: number }[];

}


export interface IPersonUI extends IPerson {
    listWeightForTemplate? : Map<number, { monthStr: string; weight: string; evolveStatus: string }[]>;

}


export interface IPersonFirestore extends IPerson {
}

