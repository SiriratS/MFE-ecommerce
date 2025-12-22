import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '@ecommerce-platform/shared/data-access';
import { Order } from '@ecommerce-platform/shared/models';

@Component({
  selector: 'lib-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private authStore = inject(AuthStore);

  isAuthenticated = this.authStore.isAuthenticated;
  userName = this.authStore.userName;
  userEmail = this.authStore.userEmail;

  orders = signal<Order[]>([]);

  userInitial = computed(() => {
    const name = this.userName();
    return name ? name.charAt(0).toUpperCase() : 'G';
  });

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.loadMockOrders();
    }
  }

  login() {
    this.authStore.login({
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
    });
    this.loadMockOrders();
  }

  logout() {
    this.authStore.logout();
    this.orders.set([]);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'bg-neutral-100 text-neutral-700',
      processing: 'bg-neutral-200 text-neutral-800',
      shipped: 'bg-accent-100 text-accent-700',
      delivered: 'bg-neutral-900 text-white',
    };
    return classes[status] || 'bg-neutral-100 text-neutral-700';
  }

  private loadMockOrders() {
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        userId: '1',
        items: [
          {
            productId: '1',
            productName: 'Wireless Headphones',
            quantity: 1,
            price: 299.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          },
        ],
        total: 299.99,
        status: 'delivered',
        createdAt: new Date('2024-11-15'),
      },
      {
        id: 'ORD-002',
        userId: '1',
        items: [
          {
            productId: '2',
            productName: 'Smart Watch',
            quantity: 1,
            price: 399.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          },
          {
            productId: '3',
            productName: 'Laptop Backpack',
            quantity: 2,
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
          },
        ],
        total: 559.97,
        status: 'shipped',
        createdAt: new Date('2024-11-28'),
      },
    ];

    this.orders.set(mockOrders);
  }
}
