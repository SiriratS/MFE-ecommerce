import { Route } from '@angular/router';
import { ProductListComponent } from './components/product-list.component';
import { loadRemoteModule } from '@angular-architects/native-federation';


export const appRoutes: Route[] = [
    {
        path: '',
        component: ProductListComponent,
    },
    {
        path: 'cart',
        loadChildren: () =>
            loadRemoteModule('cart-mfe', './Routes').then((m) => m.CART_ROUTES),
    },
    {
        path: 'profile',
        loadChildren: () =>
            loadRemoteModule('profile-mfe', './Routes').then((m) => m.PROFILE_ROUTES),
    },
];
