import { Component, inject, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    standalone: false,
    templateUrl: './dialogAddWeight.html',
})
export class DialogAddWeight implements OnInit {

    private readonly dialogService = inject(DialogService);
    private readonly config = inject(DynamicDialogConfig);

    private readonly ref = inject(DynamicDialogRef);


    person : any = this.config.data.person;
    monthWeighted : any = this.config.data.monthWeighted;
    year : any = this.config.data.year;


    //form
    newWeight : number = 0;

    ngOnInit() {
    }



    closeDialog(data) {
        this.ref.close(data);
    }


    

}