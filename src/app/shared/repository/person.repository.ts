import { inject, Injectable, NgZone } from "@angular/core";
import { collection, deleteDoc, doc, Firestore, getDocs, onSnapshot, writeBatch } from "@angular/fire/firestore";
import { IPersonFirestore, IPersonUI } from "../class/person";
import { BehaviorSubject, Observable } from "rxjs";
import { PersonMapper } from "../mapper/person.mapper";


@Injectable({
    providedIn: 'root'
})
export class PersonRepository {

    private readonly db = inject(Firestore)
    private readonly ngZone = inject(NgZone);

    listPerson$ : BehaviorSubject<IPersonFirestore[]> = new BehaviorSubject<IPersonFirestore[]>([]);
    private listPerson : IPersonFirestore[] = [];


    private readonly personsToLoad: IPersonFirestore[] = [
            {
                "id": "1",
                "name": "Saskia",
                "surname": "Smith",
                "listWeight": [
                    { "date": "01-01-2026", "weight": 70 },
                    { "date": "01-02-2026", "weight": 68 },
                    { "date": "01-05-2026", "weight": 65 },
                    { "date": "01-09-2026", "weight": 62 },
                    { "date": "01-02-2027", "weight": 66 }
                ],
                "chambreNumber": "0001",
                "aileName": "Azurite"
            },
            {
                "id": "2",
                "name": "John",
                "surname": "Doe",
                "listWeight": [
                    { "date": "01-01-2026", "weight": 80 }
                ],
                "chambreNumber": "0002",
                "aileName": "Saphire"
            },
            {
                "id": "3",
                "name": "Alice",
                "surname": "Johnson",
                "listWeight": [
                    { "date": "01-01-2026", "weight": 60 },
                    { "date": "01-02-2026", "weight": 59 },
                    { "date": "01-03-2026", "weight": 58 }
                ],
                "chambreNumber": "-1003",
                "aileName": "Emeraude"
    }]

    async deleteAllAndRefill(): Promise<void> {
       await this.deleteAllPersons(); // vide la collection
       this.listPerson = this.personsToLoad; // charge les données de test
       await this.saveListPerson(); // sauvegarde la collection vide pour supprimer les documents existants
    }


    async addPerson(person: IPersonUI): Promise<void> {
        const newRef = doc(collection(this.db, 'persons')); // génère un id Firestore
        const personWithId = { ...person, id: newRef.id };
        console.log("person to add in repo : ", personWithId);
        
        this.listPerson = [...this.listPerson, PersonMapper.mapper_personUI_personFirestore(personWithId)];
        this.saveListPerson();
    }


    async deleteAllPersons(): Promise<void> {
        const col = collection(this.db, 'persons');
        const snapshot = await getDocs(col);
        const batch = writeBatch(this.db);
        snapshot.docs.forEach(d => batch.delete(doc(col, d.id)));
        return await batch.commit();
    }

    async deletePersonFromFirestore(id: string): Promise<void> {
        const col = collection(this.db, 'persons');
        return await deleteDoc(doc(col, id));
    }


    async saveListPerson() {
        //copie car writeBatch ne supporte pas les objets avec des propriétés en lecture seule comme les signaux et les maps
        let listPersonCopy = [...this.listPerson.map(p => PersonMapper.mapper_personUI_personFirestore(p))];
        const batch = writeBatch(this.db);
        const col = collection(this.db, 'persons');

        listPersonCopy.forEach(person => {
            const ref = person.id ? doc(col, person.id) : doc(col); // génère un id si absent
            batch.set(ref, person);
        });

        //pas besoin de mettre à jour le signal ici car on écoute les changements en temps réel avec onSnapshot,
        // donc dès que la base de données est mise à jour, le signal se met à jour automatiquement grâce à l'abonnement dans initListPerson()
        await batch.commit();
    }



    async listenerPerson(){
        onSnapshot(collection(this.db, 'persons'), (snapshot) => {

            // comme onSnapshot est en dehors d'Angular, 
            // il faut utiliser ngZone pour mettre à jour les signaux et rafraîchir la vue
            this.listPerson$.next(this.ngZone.run(() => {
                let persons: IPersonFirestore[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as IPersonFirestore));
                return persons
            }))
        });
    }
}