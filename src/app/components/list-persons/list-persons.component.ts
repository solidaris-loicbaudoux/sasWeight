import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { PersonService } from '../../shared/services/person.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogAddWeight } from './dialog/addWeight/dialogAddWeight';
import { DialogAddPerson } from './dialog/addResident/dialogAddPerson';
import { take } from 'rxjs';
import { AileRepository } from '../../shared/repository/aile.repository';
import { IPersonUI } from '../../shared/class/person';
import { IAile } from '../../shared/class/aile';
import { PersonFormFactory } from '../../shared/helper/formFactory/person';


@Component({
  selector: 'app-list-persons',
  standalone: false,
  templateUrl: './list-persons.component.html',
  styleUrl: './list-persons.component.scss',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPersonsComponent implements OnInit {

    private readonly personService = inject(PersonService);
    private readonly messageService = inject(MessageService);
    private readonly dialogService = inject(DialogService);
    private readonly confirmationService = inject(ConfirmationService);


    readonly personList = this.personService.listPerson_S;
    readonly loadingData = this.personService.loadingData;

    statuses!: SelectItem[];


    //perlet de cloner la person qui est en train d'être édité pour pouvoir annuler les modifications si besoin
    clonedPerson: { [s: string]: IPersonUI } = {};
    expandedRows: { [key: string]: boolean } = {};


    listAiles : IAile[] = null;

    personToEditForm = PersonFormFactory.createPersonToAddForm()
    editOnlyOneRow : boolean = false;
    personToEditId!: string;

    constructor() {
      this.listAiles = new AileRepository().get();
    }

    ngOnInit()
    {
      this.personService.initListPerson()
    }

    toggleRow(person: IPersonUI): void {
      if (this.expandedRows[person.id]) {
          delete this.expandedRows[person.id];
      } else {
          this.expandedRows[person.id] = true;
      }
      this.expandedRows = { ...this.expandedRows };
    }

    onRowEditInit(person: IPersonUI)
    {
      //on autorise l'édition d'une seule ligne à la fois pour éviter les problèmes 
      // de formulaire réactif qui se mélange entre les différentes 
      // lignes si on en édite plusieurs en même temps
      this.editOnlyOneRow = true
      
      this.personToEditId = person.id
      this.personToEditForm.reset();  // au cas où l'instance serait réutilisée
      this.personToEditForm.patchValue({
        name: person.name,
        surname: person.surname,
        chambreNumber: person.chambreNumber,
        aileName: this.listAiles.find(aile => aile.label === person.aileName)?.label || ''
      })
    }

    onRowEditSave()
    {
      let personToUpdate = this.personToEditForm.value;
      personToUpdate.id = this.personToEditId;
      this.personService.updatePerson(personToUpdate);
      //on autorise l'édition d'une seule ligne à la fois pour éviter les problèmes 
      // de formulaire réactif qui se mélange entre les différentes 
      // lignes si on en édite plusieurs en même temps
      this.editOnlyOneRow = false
    }


    onRowEditCancel() {
      //on autorise l'édition d'une seule ligne à la fois pour éviter les problèmes 
      // de formulaire réactif qui se mélange entre les différentes 
      // lignes si on en édite plusieurs en même temps
      this.editOnlyOneRow = false
    }



    deletePerson(id: string) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Voulez-vous supprimer ce résident ?',
        header: 'Zone de danger',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Annuler',
        rejectButtonProps: {
            label: 'Annuler',
            severity: 'secondary',
            outlined: true
        },
        acceptButtonProps: {
            label: 'Supprimer',
            severity: 'danger'
        },
    
        accept: () => {
            this.personService.deletePerson(id);
            this.editOnlyOneRow = true
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Annulé', detail: 'Vous avez annulé' });
            this.editOnlyOneRow = true
        }
      });

    }




    deleteAllAndRefill(){
      this.personService.deleteAllAndRefill()
    }


    addPerson(){
      let ref = this.dialogService.open(DialogAddPerson, { 
          header: 'Ajouter un résident',
          width: '30%',
          height: '60%',
          data: {
          }
      });

      ref.onClose.pipe(take(1)).subscribe((personToAdd) => {
        if (personToAdd) {
          setTimeout(() => {
            this.personService.addPerson(personToAdd);
          }, 200);
        }
      })
    }


    editMonthClicked(person, monthWeighted, year)
    {
      let ref = this.dialogService.open(DialogAddWeight, { 
          header: 'Ajouter un poids',
          data: {
            person: person,
            monthWeighted: monthWeighted,
            year: year
          }
      });

      ref.onClose.pipe(take(1)).subscribe((newWeight) => {
        if (newWeight) {

          //on crée une variable pour stocker la date du jour au format "month-year" 
          // pour pouvoir comparer avec la date du poids ajouté et éviter de modifier 
          // un poids d'un mois précédent
          //on gère les 0 pour les mois inférieurs à 10 pour que le format soit toujours le même
          let currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
          let currentYear = new Date().getFullYear();
          let currentMonthYear = `${currentMonth}-${currentYear}`;
          //on slice 3 pour enlever le jour de la date du poids et ne garder que le mois et l'année pour la comparaison
          //car on encode que le mois et l'année dans la date du poids pour éviter les problèmes de comparaison de date avec les jours
          let ifExistWeightForMonth = person.listWeight.find((weightEntry) => (weightEntry.date).slice(3) === currentMonthYear);
          //c'est qu'on est sur le même mois et la même année que le poids ajouté, on peut donc modifier le poids du mois en cours
          if(ifExistWeightForMonth){
            person.listWeight = person.listWeight.map((weightEntry) => {
              if(weightEntry.date === ifExistWeightForMonth.date) {
                return { date: weightEntry.date, weight: newWeight };
              }
              return weightEntry;
            })
            this.personService.updatePerson(person);
          }
        }
      })
    }

    
    
    //NgClass
    getClassSeverity(monthWeighted: any): string {
        if(monthWeighted.weight === "/") return "bg-gray-500 text-gray-100";

        else if(monthWeighted.evolveStatus?.includes("decrease")) return "bg-red-500 text-red-100";
        else if(monthWeighted.evolveStatus?.includes("increase")) return "bg-green-500 text-green-100";
        else return "bg-blue-500 text-blue-100";
    }

    getClassIcon(monthWeighted: any): string {
        if(monthWeighted.weight === "/") return "pi-minus";

        else if(monthWeighted.evolveStatus?.includes("decrease")) return "pi-arrow-down";
        else if(monthWeighted.evolveStatus?.includes("increase")) return "pi-arrow-up";
        else return "pi-minus";
    }
}
