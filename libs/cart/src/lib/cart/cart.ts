import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartStore } from '@ecommerce-platform/shared/data-access';

@Component({
  selector: 'lib-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {
  private cartStore = inject(CartStore);

  items = this.cartStore.items;
  totalItems = this.cartStore.totalItems;
  totalPrice = this.cartStore.totalPrice;
  isEmpty = this.cartStore.isEmpty;

  increaseQuantity(productId: string, currentQuantity: number) {
    this.cartStore.updateQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: string, currentQuantity: number) {
    this.cartStore.updateQuantity(productId, currentQuantity - 1);
  }

  removeItem(productId: string) {
    this.cartStore.removeItem(productId);
  }
}
