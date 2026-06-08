import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { createPersonToAddForm, PersonForFirestore } from '../../../shared/domain/person';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Aile, ListAiles } from '../../../shared/domain/aile';


@Component({
    standalone: false,
    templateUrl: './dialogAddPerson.html',
        changeDetection: ChangeDetectionStrategy.OnPush,  // ← ajouter ici
})
export class DialogAddPerson implements OnInit {

    private readonly ref = inject(DynamicDialogRef);

    private readonly fb = inject(FormBuilder)

    personToAdd : PersonForFirestore = {
        name: '',
        surname: '',
        listWeight: [],
        chambreNumber: '',
        aileName: ''
    };

    personToAddForm = createPersonToAddForm()

    listAiles : Aile[] = ListAiles

    isClosing = false;

    constructor() {
    }

    ngOnInit() {
        this.personToAddForm.reset();  // au cas où l'instance serait réutilisée
    }

    closeDialog(save: boolean) {
        this.isClosing = true;
        let isFormValid = this.personToAddForm.valid;
        //disable pour eviter les flash de l'interface qui montre que le dialog est encore ouvert alors qu'on est en train de le fermer
        this.personToAddForm.disable({ emitEvent: false });
        if(save && isFormValid) {
            this.ref.close(this.personToAddForm.value);
        } else {
            this.ref.close();
        }
    }
}