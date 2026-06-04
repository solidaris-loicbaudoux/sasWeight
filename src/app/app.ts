import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cart } from './cart/cart';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Product } from './shared/models/product.model';
import { DialogAddProduct } from './dialog-add-product/dialog-add-product';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule, Cart, Button, DialogAddProduct],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('demo');
  displayDialog = signal(false);

  items: MenuItem[] = [
    {
      label: 'Accueil',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
      label: 'Produits',
      icon: 'pi pi-shopping-cart',
      routerLink: ['/products']
    },
  ];


  showDialog() {
    this.displayDialog.set(!this.displayDialog());
  }

  closeByChild(close: boolean) {
    this.displayDialog.set(close);
  }
}
