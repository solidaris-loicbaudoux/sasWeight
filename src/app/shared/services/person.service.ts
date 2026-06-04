import { effect, inject, Injectable, signal, Signal, WritableSignal } from "@angular/core";
import { Person } from "../domain/person";
import { MessageService } from "primeng/api";
import { collection, doc, Firestore, getDocs, onSnapshot, setDoc, writeBatch } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class PersonService {


    private readonly db = inject(Firestore)
    listPerson_S : WritableSignal<Person[]> = signal<Person[]>([]);
    private readonly messageService = inject(MessageService);

    loadingData = signal(true);
    isFirstLoad = true; // pour éviter de sauvegarder la collection vide au premier chargement

    
    constructor() {
        effect(() => {
            if(this.listPerson_S().length > 0 && !this.isFirstLoad) {
                this.saveListPerson()
                this.isFirstLoad = false;
            }
        })
    }

    async initListPerson() {
        // écoute en temps réel — se met à jour automatiquement si un autre utilisateur modifie
        onSnapshot(collection(this.db, 'persons'), (snapshot) => {
            let persons: Person[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Person));
            persons.forEach(p => this.fillDataForChart(p));
            this.listPerson_S.set(persons);
            this.loadingData.set(false);
            console.log("Persons updated from Firestore", persons);
        });
    }



    // méthode pour remplir la base de données avec des données de test depuis un fichier JSON
    //en vidant d'abord la collection pour éviter les doublons
    async deleteAllAndRefill(){
        let personsToLoad : Person[]= [
            {
                "id": "1",
                "name": "Saskia",
                "surname": "Smith",
                "listWeight": [
                    {
                        "date": "01-01-2024",
                        "weight": 70
                    },
                    {
                        "date": "01-02-2024",
                        "weight": 68
                    }
                ],
                "chambreNumber": "0001",
                "aileName": "Azurite"
            },
            {
                "id": "2",
                "name": "John",
                "surname": "Doe",
                "listWeight": [
                    {
                        "date": "01-01-2024",
                        "weight": 80
                    }
                ],
                "chambreNumber": "0002",
                "aileName": "Saphire"
            },
            {
                "id": "3",
                "name": "Alice",
                "surname": "Johnson",
                "listWeight": [
                    {
                        "date": "01-01-2024",
                        "weight": 60
                    },
                    {
                        "date": "01-02-2024",
                        "weight": 59
                    },
                    {
                        "date": "01-03-2024",
                        "weight": 58
                    }
                ],
                "chambreNumber": "-1003",
                "aileName": "Emeraude"
            }
        ]

        await this.deleteAllPersons(); // vide la collection
        this.listPerson_S.set(personsToLoad); // charge les données de test
        await this.saveListPerson(); // sauvegarde la collection vide pour supprimer les documents existants

        console.log(personsToLoad)
    }


    fillDataForChart(person: Person): Person {
        if (person.listWeight.length === 0) {
            person.listWeightForChart = { labels: [], datasets: [] };
            return person;
        }

        const documentStyle = getComputedStyle(document.documentElement);

        const sorted = [...person.listWeight].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        person.listWeightForChart = {
            labels: sorted.map(w => w.date),
            datasets: [{
                label: 'Poids (kg)',
                data: sorted.map(w => w.weight),
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                tension: 0.4
            }]
        };

        return person;
    }


    updatePerson(person: Person) : void {
        const index = this.listPerson_S().findIndex(p => p.id === person.id);
        if (index !== -1) {
            this.listPerson_S.set([...this.listPerson_S().slice(0, index), person, ...this.listPerson_S().slice(index + 1)]);
        }
    }        


    addPerson(person: Person) : void{
        const newRef = doc(collection(this.db, 'persons')); // génère un id Firestore
        const personWithId = { ...person, id: newRef.id };
        this.listPerson_S.set([...this.listPerson_S(), personWithId]);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Person ajoutée' });
    }

    deletePerson(id: string) : void{
        this.listPerson_S.set(this.listPerson_S().filter(p => p.id !== id));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Person supprimée' });
    }


    async deleteAllPersons(): Promise<void> {
        const col = collection(this.db, 'persons');
        const snapshot = await getDocs(col);
        
        const batch = writeBatch(this.db);
        snapshot.docs.forEach(d => batch.delete(doc(col, d.id)));
        await batch.commit();
        
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Collection vidée' });
    }

    private async saveListPerson() {
        const batch = writeBatch(this.db);
        const col = collection(this.db, 'persons');

        this.listPerson_S().forEach(person => {
            const ref = person.id ? doc(col, person.id) : doc(col); // génère un id si absent
            batch.set(ref, person);
        });
        await batch.commit();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'List of persons saved' });
    }
}