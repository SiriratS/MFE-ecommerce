import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore, AuthStore } from '@ecommerce-platform/shared/data-access';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div class="container-custom py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="text-2xl font-semibold text-neutral-900 hover:text-neutral-700 transition-colors">
              EMPOR
            </a>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a
              routerLink="/"
              routerLinkActive="text-neutral-900 font-medium"
              [routerLinkActiveOptions]="{ exact: true }"
              class="text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
            >
              Shop
            </a>
            <a
              routerLink="/cart"
              routerLinkActive="text-neutral-900 font-medium"
              class="text-neutral-600 hover:text-neutral-900 transition-colors relative text-sm"
            >
              Cart
              @if (cartItemCount() > 0) {
                <span class="absolute -top-2 -right-3 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {{ cartItemCount() }}
                </span>
              }
            </a>
            <a
              routerLink="/profile"
              routerLinkActive="text-neutral-900 font-medium"
              class="text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
            >
              Profile
            </a>
          </div>

          <!-- User Info & Actions -->
          <div class="flex items-center space-x-4">
            @if (isAuthenticated()) {
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 bg-neutral-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {{ userInitial() }}
                </div>
                <span class="hidden md:inline text-sm text-neutral-700 font-medium">{{ userName() }}</span>
              </div>
            } @else {
              <button
                (click)="login()"
                class="px-5 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                Sign In
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
