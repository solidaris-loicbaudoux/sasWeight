import {  IPersonFirestore, IPersonUI,   } from "../class/person";



export class PersonMapper {
    static mapper_personUI_personFirestore(person: IPersonUI): IPersonFirestore {
        return {
            id: person.id,
            name: person.name,
            surname: person.surname,
            listWeight: person.listWeight ?? [],
            chambreNumber: person.chambreNumber,
            aileName: person.aileName
        };
    }
}