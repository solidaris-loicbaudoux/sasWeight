import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
    },
    {
        path: 'products',
        loadComponent: () => import('./productsList/productsList').then(c => c.ProductsList)
    },
    {
        path: '**',
        redirectTo: 'products'
    }
];
