import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { PersonService } from '../../shared/services/person.service';
import { listMonths } from '../../shared/utils/others';

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent {

  private readonly cd = inject(ChangeDetectorRef);
  platformId = inject(PLATFORM_ID);

  private readonly personService = inject(PersonService);



    dataChart: any;
    optionsChart: any;

    ngOnInit() {
        this.initChart();
    }

    constructor() {
      effect(() => {
        if(this.personService.chartData_S().length > 0) {
          this.initChart();
        }
      });
    }

    initChart()
    {
      if (isPlatformBrowser(this.platformId)) 
      {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    
        this.dataChart = {
            labels: listMonths,            
            datasets: this.personService.chartData_S()
        };
    
        this.optionsChart = {
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
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
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  },
                  min:30,
                  max:180
              }
          }
        };
        this.cd.markForCheck();
      }
    }
}
