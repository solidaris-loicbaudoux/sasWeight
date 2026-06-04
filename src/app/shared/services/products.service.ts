import { HttpClient, httpResource } from "@angular/common/http";
import { inject, Injectable, linkedSignal, Signal, signal, WritableSignal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Product, ProductResultDTO } from "../models/product.model";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    productsList : WritableSignal<Product[]> = signal([]);
    private httpClient: HttpClient = inject(HttpClient);

    constructor() { }

    fetchProducts() {
        const productListSignal = toSignal<Product[]>(this.httpClient.get('./data_access/products.json').pipe(
                map((data: any) => {
                    if(data) return data.products
                    else return []
                }),
                map((data: any[]) => {
                    return this.productsList_to_productsLight(data)
                })
            ),
        );

        this.productsList = linkedSignal(() => productListSignal() ?? [])
    }


    private productsList_to_productsLight(data: ProductResultDTO[]): Product[] {
        return data.map(product => {
            return new Object({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                rating: product.rating,
                image: product.image
            }) as Product
        })
    }

    addProduct(newProduct: Product) {
        this.productsList.update(products => [...products, newProduct]);
    }
}