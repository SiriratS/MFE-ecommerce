import { Route } from '@angular/router';
import { CartComponent } from '@ecommerce-platform/cart';

export const CART_ROUTES: Route[] = [
    {
        path: '',
        component: CartComponent,
    },
];
