import { IAile } from "../class/aile";



export interface IAileRepository{
    get(): IAile[];
    getOneByLabel(label: string): IAile | undefined;
}



export class AileRepository implements IAileRepository {

    protected ailes: IAile[] = [
        {"label": "Saphir"}, 
        {"label": "Azurite"}, 
        {"label": "Améthyste"}, 
        {"label": "Topaze"}, 
        {"label": "Emeraude"}, 
        {"label": "Ambre"}
    ]
    
    /**
     * Retourne la liste des ailes disponibles.
     * @returns IAile[] - Un tableau d'objets IAile représentant les ailes disponibles.
     */
    get(): IAile[] {
        return this.ailes;
    }

    /**
     * Retourne une aile spécifique en fonction de son label.
     * @param label - Le label de l'aile à rechercher.
     * @returns IAile | undefined - L'objet IAile correspondant au label, ou undefined si non trouvé.
     */
    getOneByLabel(label: string): IAile | undefined {
        return this.ailes.find(aile => aile.label === label);
    }

}


