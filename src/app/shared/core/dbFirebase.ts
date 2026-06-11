import { inject, NgZone } from "@angular/core";
import { CollectionReference, Firestore, collection, deleteDoc, doc, onSnapshot, writeBatch } from "@angular/fire/firestore";
import { IPersonFirestore } from "../models/person";
import { Observable } from "rxjs";

export class dbFirebase {

    private readonly db = inject(Firestore);

    protected collection : CollectionReference;

    private readonly ngZone = inject(NgZone);

    constructor(collectionName : string) {
        this.collection = collection(this.db, collectionName);
    }

    createBatch(){
        return writeBatch(this.db);
    }


    /**
     * Génère un id unique en utilisant la méthode de Firestore pour créer une référence de document sans l'enregistrer, puis en récupérant son id.
     * Cette approche garantit que l'id est unique et compatible avec les règles de Firestore, même si le document n'est pas encore créé.
     * @return l'id généré par Firestore
    */
    generateId_id(){
        return doc(this.collection).id;
    }

    /**
     * Génère un id unique en utilisant la méthode de Firestore pour créer une référence de document sans l'enregistrer, puis en récupérant son id.
     * Cette approche garantit que l'id est unique et compatible avec les règles de Firestore, même si le document n'est pas encore créé.
     * @return document reference avec un id unique généré par Firestore
     */
    generateId_docref(){
        return doc(this.collection);
    }

    getById(id: string) {
        return doc(this.collection, id);
    }

    async deleteById(id: string) {
        return await deleteDoc(this.getById(id));
    }


    getListener() {

        return new Observable<IPersonFirestore[]>(observer => {
            const unsubscribe = onSnapshot(this.collection, (snapshot) => {

                // comme onSnapshot est en dehors d'Angular, 
                // il faut utiliser ngZone pour mettre à jour les signaux et rafraîchir la vue
                this.ngZone.run(() => {
                    let persons: IPersonFirestore[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as IPersonFirestore));
                    observer.next(persons);
                })
            });

            // Retourne une fonction de nettoyage pour se désabonner lorsque l'observable est complété ou annulé
            return () => unsubscribe();
        })
    }
}