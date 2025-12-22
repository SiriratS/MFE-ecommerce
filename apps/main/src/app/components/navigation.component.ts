import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore, AuthStore } from '@ecommerce-platform/shared/data-access';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <nav class="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-4">
            <a routerLink="/" class="text-2xl font-bold hover:text-primary-100 transition-colors">
              🛍️ ShopHub
            </a>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-6">
            <a
              routerLink="/"
              routerLinkActive="text-primary-100 font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="hover:text-primary-100 transition-colors"
            >
              Products
            </a>
            <a
              routerLink="/cart"
              routerLinkActive="text-primary-100 font-semibold"
              class="hover:text-primary-100 transition-colors relative"
            >
              Cart
              @if (cartItemCount() > 0) {
                <span class="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {{ cartItemCount() }}
                </span>
              }
            </a>
            <a
              routerLink="/profile"
              routerLinkActive="text-primary-100 font-semibold"
              class="hover:text-primary-100 transition-colors"
            >
              Profile
            </a>
          </div>

          <!-- User Info -->
          <div class="flex items-center space-x-4">
            @if (isAuthenticated()) {
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
                  {{ userInitial() }}
                </div>
                <span class="hidden md:inline">{{ userName() }}</span>
              </div>
            } @else {
              <button
                (click)="login()"
                class="bg-secondary-500 hover:bg-secondary-600 px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                Login
              </button>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
    styles: [],
})
export class NavigationComponent {
    private cartStore = inject(CartStore);
    private authStore = inject(AuthStore);

    cartItemCount = this.cartStore.totalItems;
    isAuthenticated = this.authStore.isAuthenticated;
    userName = this.authStore.userName;

    userInitial = computed(() => {
        const name = this.userName();
        return name ? name.charAt(0).toUpperCase() : 'G';
    });

    login() {
        // Mock login for demo
        this.authStore.login({
            id: '1',
            email: 'demo@example.com',
            name: 'Demo User',
        });
    }
}
