import { Route } from '@angular/router';
import { ProductListComponent } from './components/product-list.component';


export const appRoutes: Route[] = [
    {
        path: '',
        component: ProductListComponent,
    },
    {
        path: 'cart',
        loadComponent: () => import('@ecommerce-platform/cart').then((m) => m.CartComponent),
    },
    {
        path: 'profile',
        loadComponent: () => import('@ecommerce-platform/profile').then((m) => m.ProfileComponent),
    },
];
