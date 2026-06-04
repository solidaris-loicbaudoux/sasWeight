
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Button } from "primeng/button";
import { Popover } from "primeng/popover";


interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}


@Component({
    selector: 'app-cart',
    templateUrl: './cart.html',
    styleUrls: ['./cart.scss'],
    imports: [Popover, Button],
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Cart {
  cartItems = signal<CartItem[]>([
    {
      id: 1,
      name: 'Laptop Dell XPS',
      price: 1299,
      quantity: 1,
      image: 'https://placehold.co/600x400?text=Hello+World'
    },
    {
      id: 2,
      name: 'Smartphone Samsung',
      price: 899,
      quantity: 2,
      image: 'https://placehold.co/600x400?text=Hello+World'
    }
  ]);

  getTotal(): number {
    return this.cartItems().reduce((sum : any, item: any) => sum + (item.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.cartItems().reduce((sum : any, item: any) => sum + item.quantity, 0);
  }
    constructor() {}
}
