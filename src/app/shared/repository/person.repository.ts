import { inject, Injectable, NgZone, signal, WritableSignal } from "@angular/core";
import { deleteDoc, doc, getDocs, onSnapshot } from "@angular/fire/firestore";
import { IPersonFirestore, IPersonUI } from "../models/person";
import { BehaviorSubject } from "rxjs";
import { PersonMapper } from "../mapper/person.mapper";
import { dbFirebase } from "../core/dbFirebase";
import { PersonsToLoad } from "../core/mocksDataTest/person.mock";


@Injectable({
    providedIn: 'root'
})
export class PersonRepository extends dbFirebase{

    listPerson_S : WritableSignal<IPersonFirestore[]> = signal<IPersonFirestore[]>([]);

    constructor() {
        super('persons');
    }


    async deleteAllAndRefill(): Promise<void> {
       await this.deleteAllPersons(); // vide la collection
       this.listPerson_S.set(PersonsToLoad); // charge les données de test
       await this.saveListPerson(); // sauvegarde la collection vide pour supprimer les documents existants
    }


    async addPerson(person: IPersonUI): Promise<void> {
        const id = this.generateId_id(); // génère un id Firestore
        const personWithId = { ...person, id: id };
        console.log("person to add in repo : ", personWithId);
        
        this.listPerson_S.set([...this.listPerson_S(), PersonMapper.mapper_personUI_personFirestore(personWithId)]);
        await this.saveListPerson();
    }


    async deleteAllPersons(): Promise<void> {
        const snapshot = await getDocs(this.collection);
        const batch = this.createBatch();
        snapshot.docs.forEach(d => batch.delete(this.getById(d.id)));
        return await batch.commit();
    }


    async deletePersonFromFirestore(id: string): Promise<void> {
        return await this.deleteById(id)
    }


    async saveListPerson() {
        //copie car writeBatch ne supporte pas les objets avec des propriétés en lecture seule comme les signaux et les maps
        console.log("listPerson_S to save in firestore : ", this.listPerson_S());
        let listPersonCopy = [...this.listPerson_S().map(p => PersonMapper.mapper_personUI_personFirestore(p))];
        const batch = this.createBatch();

        console.log("listPersonCopy to save in firestore : ", listPersonCopy);
        listPersonCopy.forEach(person => {
            const ref = person.id ? this.getById(person.id) : this.generateId_docref(); // génère un id si absent
            batch.set(ref, person);
        });

        //pas besoin de mettre à jour le signal ici car on écoute les changements en temps réel avec onSnapshot,
        // donc dès que la base de données est mise à jour, le signal se met à jour automatiquement grâce à l'abonnement dans initListPerson()
        await batch.commit();
    }



    listenerPerson(){
        return this.getListener()
    }
}