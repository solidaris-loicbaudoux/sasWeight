import { ChangeDetectionStrategy, Component, effect, inject, input, Input, output, signal } from "@angular/core";
import { Button } from "primeng/button";
import { Dialog } from "primeng/dialog";
import { InputNumber } from "primeng/inputnumber";
import { InputText } from "primeng/inputtext";
import { ProductsService } from "../shared/services/products.service";
import { Product } from "../shared/models/product.model";

@Component({
    selector: 'dialog-add-product',
    templateUrl: './dialog-add-product.html',
    styleUrls: ['./dialog-add-product.scss'],
    imports: [Button, Dialog, InputText, InputNumber],
    changeDetection : ChangeDetectionStrategy.OnPush
})
export class DialogAddProduct {

    readonly displayDialogInput = input.required<boolean>(); //permet d'indiquer que cette input est obligatoire et donc de ne pas avoir de undefined recu
    isDisplayed : boolean = false
    closeDialogEvent = output<boolean>();


    private readonly productsService = inject(ProductsService)
    

    constructor(
    ){
        //on pourrais ne pas utiliser de boolean intermédiaire et utiliser directement displayDialogInput dans le template
        //mais prime ne permet pas de lier directement une input à une propriété de son composant dialog
        //d'où l'utilisation d'un boolean intermédiaire isDisplayed
        effect(() => {
            //dès que la valeur de l'input displayDialogInput change, on met à jour le signal isDisplayed
            this.isDisplayed = this.displayDialogInput();
        })
    }

    closeDialog(){
        console.log("Closing dialog from child component");
        this.isDisplayed = false;
        this.closeDialogEvent.emit(false);
    }

    /*this.productsService.addProduct(new Object({
                    id: Math.floor(Math.random() * 10000),
                    name: "test ajout de produit",
                    description: "Description du produit ajouté",
                    price: 0,
                    rating: 0,
                    image: ""
                }) as Product)*/

}