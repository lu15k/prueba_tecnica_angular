import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component')
    },
    {
        path: 'entidades',
        loadComponent: () => import("./entidades/entidades.component"),
    },
    {
        path: 'contactos',
        loadComponent: () => import("./contactos/contactos.component"),
    }
];
