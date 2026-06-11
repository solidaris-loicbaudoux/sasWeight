import { effect, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { IPersonFirestore, IPersonUI } from "../models/person";
import { listMonths } from "../utils/others";
import { PersonRepository } from "../repository/person.repository";

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    private readonly messageService = inject(MessageService);

    private readonly PersonRepository = inject(PersonRepository);
    


    listPerson_S: WritableSignal<IPersonUI[]> = signal<IPersonUI[]>([]);
    loadingData = signal(true);
    chartData_S: WritableSignal<any> = signal<any>([]);


    private readonly listMonths = listMonths;

    constructor() {
        this.listPerson_S = this.PersonRepository.listPerson_S;

        effect(() => {
            if(this.listPerson_S().length > 0) {
                this.prepareChartData();
            }
        })
    }

    async initListPerson() {
        // écoute en temps réel — se met à jour automatiquement si un autre utilisateur modifie
        this.PersonRepository.listenerPerson().subscribe(persons => {
            let listPersonUI : IPersonUI[] = [];
            let copy = [...persons];
            listPersonUI = copy.map(p => this.fillDataForTemplate(p));
            listPersonUI = listPersonUI.map(p => this.compareWeightForAlert(p));
            this.listPerson_S.set(listPersonUI);
            this.loadingData.set(false);
        })
    }

    // méthode pour remplir la base de données avec des données de test depuis un fichier JSON
    //en vidant d'abord la collection pour éviter les doublons
    async deleteAllAndRefill() {
       this.PersonRepository.deleteAllAndRefill(); // vide la collection et la remplit avec les données de test
    }


    fillDataForTemplate(person: IPersonFirestore): IPersonUI {

        let personUI: IPersonUI = { ...person }; // copie pour ne pas modifier l'original

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
            personUI.listWeightForTemplate = weightForTemplate;
        }
        else personUI.listWeightForTemplate = new Map<number, any[]>();

        return personUI;
    }


    compareWeightForAlert(person: IPersonUI): IPersonUI {

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


    prepareChartData() {
        const currentYear = new Date().getFullYear();

        const personForChart = this.listPerson_S().map((person: IPersonUI) => {
            const monthlyData = person.listWeightForTemplate?.get(currentYear) ?? [];

            let lastKnownWeight: number | null = null;
            const data = monthlyData.map(entry => {
                if (entry.weight !== '/') {
                    lastKnownWeight = Number.parseFloat(entry.weight);
                }
                return lastKnownWeight;
            });

            return {
                label: `${person.name} ${person.surname}`,
                data: data
            };
        });

        this.chartData_S.set(personForChart);
    }

    updatePerson(person: IPersonUI): void {
        let index = this.listPerson_S().findIndex(p => p.id === person.id);
        let listPersonCopy = [...this.listPerson_S()];
        listPersonCopy[index] = person;
        this.listPerson_S.set(listPersonCopy);
        console.log(this.listPerson_S());
        this.PersonRepository.saveListPerson();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Résident mis à jour' });
    }


    addPerson(person: IPersonUI): void {
        this.PersonRepository.addPerson(person);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Résident ajouté' });
    }

    deletePerson(id: string): void {
        this.PersonRepository.deletePersonFromFirestore(id);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Résident supprimé' });
    }


    async deleteAllPersons(): Promise<void> {
        let res = this.PersonRepository.deleteAllPersons();
        if(res) this.messageService.add({ severity: 'info', summary: 'Information', detail: 'Collection vidée' });
        else this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression' });

    }

}