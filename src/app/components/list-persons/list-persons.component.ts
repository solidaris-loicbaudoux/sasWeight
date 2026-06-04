import { ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Person } from '../../shared/domain/person';
import { MessageService, SelectItem } from 'primeng/api';
import { PersonService } from '../../shared/services/person.service';
import { isPlatformBrowser } from '@angular/common';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-list-persons',
  standalone: false,
  templateUrl: './list-persons.component.html',
  styleUrl: './list-persons.component.scss',
})
export class ListPersonsComponent implements OnInit {

    private readonly personService = inject(PersonService);
    private readonly messageService = inject(MessageService);
    personList: Person[];
    statuses!: SelectItem[];


    //perlet de cloner la person qui est en train d'être édité pour pouvoir annuler les modifications si besoin
    clonedPerson: { [s: string]: Person } = {};
    loadingData : boolean;
    expandedRows: { [key: string]: boolean } = {};


    constructor() {
      effect(() => {
        if(this.personService.listPerson_S()) {
          this.personList = this.personService.listPerson_S();
        }

          this.loadingData = this.personService.loadingData();
      })

    }

    ngOnInit()
    {
      this.personService.initListPerson()
      this.initChart();
    }

    toggleRow(person: Person): void {
      if (this.expandedRows[person.id]) {
          delete this.expandedRows[person.id];
      } else {
          this.expandedRows[person.id] = true;
      }
      this.expandedRows = { ...this.expandedRows };
  }

    onRowEditInit(person: Person)
    {
      this.clonedPerson[person.id] = { ...person };
    }

    onRowEditSave(person: Person)
    {
        if (person) {
          this.personService.updatePerson(person);
            delete this.clonedPerson[person.id];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Person is updated' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
        }
    }

    onRowEditCancel(product: Person, index: number) {
        this.personList[index] = this.clonedPerson[product.id];
        delete this.clonedPerson[product.id];
    }


    deleteAllAndRefill(){
      this.personService.deleteAllAndRefill()
    }



    options: any;
    platformId = inject(PLATFORM_ID);
    private readonly cd = inject(ChangeDetectorRef);

    
    initChart()
    {
      Chart.register(DataLabelsPlugin);
      
      if (isPlatformBrowser(this.platformId))
      {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
      
        this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.2,
          plugins: {
            legend: {
                labels: { color: textColor }
            },
            datalabels: {
                display: true,
                color: textColor,
                anchor: 'end',
                align: 'top',
                formatter: (value: number) => `${value} kg`
            }
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            },
            y: {
              min: 30,
              max: 150,
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            }
          },
        };
        this.cd.markForCheck();
      }
    }

}
