import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { Product } from '@ecommerce-platform/shared/models';

interface ProductState {
    products: Product[];
    loading: boolean;
    selectedProduct: Product | null;
    filter: string;
}

const initialState: ProductState = {
    products: [],
    loading: false,
    selectedProduct: null,
    filter: '',
};

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        filteredProducts: computed(() => {
            const filter = store.filter().toLowerCase();
            if (!filter) return store.products();
            return store.products().filter(
                (p) =>
                    p.name.toLowerCase().includes(filter) ||
                    p.category.toLowerCase().includes(filter)
            );
        }),
        productCount: computed(() => store.products().length),
    })),
    withMethods((store) => ({
        loadProducts(products: Product[]) {
            patchState(store, { products, loading: false });
        },
        setLoading(loading: boolean) {
            patchState(store, { loading });
        },
        selectProduct(product: Product | null) {
            patchState(store, { selectedProduct: product });
        },
        setFilter(filter: string) {
            patchState(store, { filter });
        },
        addProduct(product: Product) {
            patchState(store, { products: [...store.products(), product] });
        },
    }))
);
