import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { User } from '@ecommerce-platform/shared/models';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
};

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        userName: computed(() => store.user()?.name ?? 'Guest'),
        userEmail: computed(() => store.user()?.email ?? ''),
    })),
    withMethods((store) => ({
        login(user: User) {
            patchState(store, { user, isAuthenticated: true, loading: false });
        },
        logout() {
            patchState(store, { user: null, isAuthenticated: false });
        },
        setLoading(loading: boolean) {
            patchState(store, { loading });
        },
        updateUser(user: Partial<User>) {
            if (store.user()) {
                patchState(store, { user: { ...store.user()!, ...user } });
            }
        },
    }))
);
