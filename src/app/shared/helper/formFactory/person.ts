import { inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class PersonFormFactory {

    static createPersonToAddForm() : FormGroup {
        const patternChambreNumber = "^(-1|0)\\.\\d{3}$";
        const fb = inject(FormBuilder);

        return fb.group({
            name: ["", [Validators.required]],
            surname: ["", [Validators.required]],
            chambreNumber: ["", [Validators.required, Validators.pattern(patternChambreNumber)]],
            aileName: ["", [Validators.required]]
        })
    }

}