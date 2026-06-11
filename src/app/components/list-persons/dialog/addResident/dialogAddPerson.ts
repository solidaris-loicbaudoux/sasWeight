import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder} from '@angular/forms';
import { AileRepository } from '../../../../shared/repository/aile.repository';
import { PersonFormFactory } from '../../../../shared/helper/formFactory/person';
import { IPersonFirestore } from '../../../../shared/models/person';
import { IAile } from '../../../../shared/models/aile';


@Component({
    standalone: false,
    templateUrl: './dialogAddPerson.html',
        changeDetection: ChangeDetectionStrategy.OnPush,  // ← ajouter ici
})
export class DialogAddPerson implements OnInit {

    private readonly ref = inject(DynamicDialogRef);

    private readonly fb = inject(FormBuilder)

    personToAdd : IPersonFirestore = {
        name: '',
        surname: '',
        listWeight: [],
        chambreNumber: '',
        aileName: ''
    };

    personToAddForm = PersonFormFactory.createPersonToAddForm()

    listAiles : IAile[] = null

    isClosing = false;

    constructor() {
        this.listAiles = new AileRepository().get();
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