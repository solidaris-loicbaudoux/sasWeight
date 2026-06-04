
import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../shared/services/products.service';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-products-list',
  imports: [DataViewModule, ButtonModule, TagModule, RatingModule, FormsModule],
  templateUrl: './productsList.html',
  styleUrls: ['./productsList.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsList {

  private readonly productsService : ProductsService = inject(ProductsService);

  //computed fonctionne comme effect mais à pour but de retourner une valeur et recaluculer une valeur utilisée par le signal
  //comme pour effect, tous les signaux utilisés dans le computed sont trackés et provoquent un recalcul du computed quand ils changent
  //L'effet est exécuté chaque fois que les signaux dont il dépend changent. Finalement, ça ressemble beaucoup à computed() mais avec des effets secondaires. Il n'y a pas de valeur de retour et rien n'est mis en cache.
  //préférons le computed 
  productList = computed(() => {
    console.log("Products list recomputed");
    this.productCount = this.productsService.productsList()?.length;
    return this.productsService.productsList()
  });
  productCount : number = 0;


  constructor() { 
    this.productsService.fetchProducts();
  }


}