import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { CartItem } from '@ecommerce-platform/shared/models';

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

export const CartStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        totalItems: computed(() =>
            store.items().reduce((sum, item) => sum + item.quantity, 0)
        ),
        totalPrice: computed(() =>
            store.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
        ),
        isEmpty: computed(() => store.items().length === 0),
    })),
    withMethods((store) => ({
        addItem(item: CartItem) {
            const existingItem = store.items().find((i) => i.productId === item.productId);
            if (existingItem) {
                const updatedItems = store.items().map((i) =>
                    i.productId === item.productId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
                patchState(store, { items: updatedItems });
            } else {
                patchState(store, { items: [...store.items(), item] });
            }
        },
        removeItem(productId: string) {
            patchState(store, {
                items: store.items().filter((i) => i.productId !== productId),
            });
        },
        updateQuantity(productId: string, quantity: number) {
            if (quantity <= 0) {
                this.removeItem(productId);
                return;
            }
            const updatedItems = store.items().map((i) =>
                i.productId === productId ? { ...i, quantity } : i
            );
            patchState(store, { items: updatedItems });
        },
        clearCart() {
            patchState(store, { items: [] });
        },
    }))
);
