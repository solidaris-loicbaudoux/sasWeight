import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export interface Person {
    id?: string;
    name: string;
    surname : string
    listWeight : { date: string; weight: number }[];
    chambreNumber : string;
    aileName : string;
    listWeightForTemplate? : Map<number, { monthStr: string; weight: string; evolveStatus: string }[]>;
}


export interface PersonForFirestore{
    id?: string;
    name: string;
    surname : string
    listWeight : { date: string; weight: number }[];
    chambreNumber : string;
    aileName : string;
}

export function mapper_person_personFirestore(person: Person): PersonForFirestore {
    return {
        id: person.id,
        name: person.name,
        surname: person.surname,
        listWeight: person.listWeight ?? [],
        chambreNumber: person.chambreNumber,
        aileName: person.aileName
    };
}


export function createPersonToAddForm() : FormGroup {
    const fb = new FormBuilder();
    return fb.group({
        name: ["", [Validators.required]],
        surname: ["", [Validators.required]],
        chambreNumber: ["", [Validators.required, Validators.pattern("^(-1|0)\\.\\d{3}$")]],
        aileName: ["", [Validators.required]]
    })
}


export abstract class Person{
    
}