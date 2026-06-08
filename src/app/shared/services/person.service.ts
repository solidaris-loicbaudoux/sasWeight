import { effect, inject, Injectable, signal, Signal, WritableSignal, NgZone } from "@angular/core";
import { mapper_person_personFirestore, Person } from "../domain/person";
import { MessageService } from "primeng/api";
import { collection, deleteDoc, doc, Firestore, getDocs, onSnapshot, setDoc, writeBatch } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class PersonService {


    private readonly db = inject(Firestore)
    listPerson_S: WritableSignal<Person[]> = signal<Person[]>([]);
    private readonly messageService = inject(MessageService);

    loadingData = signal(true);

    private readonly listMonths = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];


    constructor() {
    }

    private readonly ngZone = inject(NgZone);
    async initListPerson() {
        // écoute en temps réel — se met à jour automatiquement si un autre utilisateur modifie
        onSnapshot(collection(this.db, 'persons'), (snapshot) => {
            // comme onSnapshot est en dehors d'Angular, 
            // il faut utiliser ngZone pour mettre à jour les signaux et rafraîchir la vue
            this.ngZone.run(() => {
                let persons: Person[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Person));
                persons.forEach(p => this.fillDataForTemplate(p));

                persons.forEach(p => this.compareWeightForAlert(p));
                this.listPerson_S.set(persons);
                this.loadingData.set(false);
            })
        });
    }

    // méthode pour remplir la base de données avec des données de test depuis un fichier JSON
    //en vidant d'abord la collection pour éviter les doublons
    async deleteAllAndRefill() {
        let personsToLoad: Person[] = [
            {
                "id": "1",
                "name": "Saskia",
                "surname": "Smith",
                "listWeight": [
                    {
                        "date": "01-01-2026",
                        "weight": 70
                    },
                    {
                        "date": "01-02-2026",
                        "weight": 68
                    },
                    {
                        "date": "01-05-2026",
                        "weight": 65
                    },
                    {
                        "date": "01-09-2026",
                        "weight": 62
                    },
                    {
                        "date": "01-02-2027",
                        "weight": 66
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
                        "date": "01-01-2026",
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
                        "date": "01-01-2026",
                        "weight": 60
                    },
                    {
                        "date": "01-02-2026",
                        "weight": 59
                    },
                    {
                        "date": "01-03-2026",
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

    }


    fillDataForTemplate(person: Person): Person {

        //générer des années et les mois pour la timeline
        let currentYear = new Date().getFullYear();
        let weightForTemplate: Map<number, any[]> = new Map<number, any[]>();

        for (let year = currentYear; year <= currentYear + 1; year++) {

            for (let month = 1; month <= 12; month++) {
                let monthStr = this.listMonths[month - 1];

                //recupérer un poid si une date correspond au mois et à l'année en cours
                let weightIncludedInMonth = person.listWeight.find(w => {
                    let [_, wMonth, wYear] = w.date.split('-').map(Number);
                    return wMonth === month && wYear === year;
                })

                if (weightIncludedInMonth) {
                    let weight = weightIncludedInMonth.weight + " kg"
                    weightForTemplate.set(year, [...(weightForTemplate.get(year) || []), { monthStr: monthStr, weight: weight }]);
                }
                else {
                    weightForTemplate.set(year, [...(weightForTemplate.get(year) || []), { monthStr: monthStr, weight: "/" }]);
                }
            }
        }

        if (weightForTemplate.size > 0) {
            person.listWeightForTemplate = weightForTemplate;
        }
        else person.listWeightForTemplate = new Map<number, any[]>();

        return person;
    }


    compareWeightForAlert(person: Person): Person {

        if (person.listWeightForTemplate.size > 0) {
            person.listWeightForTemplate.forEach((events, year) => {

                //il faut comparer le poids du mois en cours avec celui du mois précédent pour voir s'il y a une augmentation ou une diminution
                events.forEach((event: any, index: number) => {
                    if (event.weight !== "/") {
                        let weightValue = Number.parseFloat(event.weight);

                        // Chercher en arrière dans les mois précédents du même année
                        let previousWeightEvent: any = null;

                        for (let i = index - 1; i >= 0; i--) {
                            if (events[i].weight !== "/") {
                                previousWeightEvent = events[i];
                                break;
                            }
                        }

                        // Si pas trouvé dans l'année courante, chercher dans les années précédentes
                        if (!previousWeightEvent) {
                            const sortedYears = Array.from(person.listWeightForTemplate.keys())
                                .filter(y => y < year)
                                .sort((a, b) => b - a); // décroissant pour prendre la plus récente en premier

                            for (const prevYear of sortedYears) {
                                const prevEvents = person.listWeightForTemplate.get(prevYear);
                                if (prevEvents) {
                                    for (let i = prevEvents.length - 1; i >= 0; i--) {
                                        if (prevEvents[i].weight !== "/") {
                                            previousWeightEvent = prevEvents[i];
                                            break;
                                        }
                                    }
                                }
                                if (previousWeightEvent) break;
                            }
                        }

                        if (previousWeightEvent) {
                            let previousWeightInNumber = Number.parseFloat(previousWeightEvent.weight);
                            if (weightValue < previousWeightInNumber) event.evolveStatus = "decrease";
                            else if (weightValue > previousWeightInNumber) event.evolveStatus = "increase";
                            else event.evolveStatus = "stable";
                        }
                        //console.log(event.evolveStatus);
                    }
                });

            })
        }

        return person
    }

    updatePerson(person: Person): void {
        const index = this.listPerson_S().findIndex(p => p.id === person.id);
        if (index !== -1) {
            let index = this.listPerson_S().findIndex(p => p.id === person.id);
            let listPersonCopy = [...this.listPerson_S()];
            listPersonCopy[index] = person;
            this.listPerson_S.set(listPersonCopy);
            this.saveListPerson();
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Résident mis à jour' });
        }
    }


    addPerson(person: Person): void {
        const newRef = doc(collection(this.db, 'persons')); // génère un id Firestore
        const personWithId = { ...person, id: newRef.id };
        this.listPerson_S.set([...this.listPerson_S(), personWithId]);
        this.saveListPerson();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Résident ajouté' });
    }

    deletePerson(id: string): void {
        this.deletePersonFromFirestore(id);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Résident supprimé' });
    }


    async deleteAllPersons(): Promise<void> {
        const col = collection(this.db, 'persons');
        const snapshot = await getDocs(col);

        const batch = writeBatch(this.db);
        snapshot.docs.forEach(d => batch.delete(doc(col, d.id)));
        await batch.commit();
        this.messageService.add({ severity: 'info', summary: 'Information', detail: 'Collection vidée' });
    }

    private async saveListPerson() {
        //copie car writeBatch ne supporte pas les objets avec des propriétés en 
        // lecture seule comme les signaux et les maps
        let listPersonCopy = [...this.listPerson_S().map(p => mapper_person_personFirestore(p))];
        const batch = writeBatch(this.db);
        const col = collection(this.db, 'persons');

        listPersonCopy.forEach(person => {
            const ref = person.id ? doc(col, person.id) : doc(col); // génère un id si absent
            batch.set(ref, person);
        });
        await batch.commit();
    }


    private async deletePersonFromFirestore(id: string): Promise<void> {
        const col = collection(this.db, 'persons');
        await deleteDoc(doc(col, id));
    }
}