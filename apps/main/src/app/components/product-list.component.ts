import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductStore, CartStore } from '@ecommerce-platform/shared/data-access';
import { Product } from '@ecommerce-platform/shared/models';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container mx-auto px-6 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Product Catalog</h1>
        
        <!-- Search/Filter -->
        <div class="flex items-center space-x-4">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search products..."
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div class="text-gray-600">
            {{ productCount() }} products
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p class="mt-4 text-gray-600">Loading products...</p>
        </div>
      }

      <!-- Product Grid -->
      @if (!loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of filteredProducts(); track product.id) {
            <div class="card group cursor-pointer">
              <!-- Product Image -->
              <div class="relative overflow-hidden rounded-lg mb-4 bg-gray-100 h-48">
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                @if (!product.inStock) {
                  <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span class="text-white font-bold">Out of Stock</span>
                  </div>
                }
              </div>

              <!-- Product Info -->
              <div class="space-y-2">
                <div class="flex items-start justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
                    {{ product.name }}
                  </h3>
                </div>
                
                <p class="text-sm text-gray-600 line-clamp-2">
                  {{ product.description }}
                </p>

                <div class="flex items-center justify-between pt-2">
                  <span class="text-2xl font-bold text-primary-600">
                    \${{ product.price.toFixed(2) }}
                  </span>
                  <span class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    {{ product.category }}
                  </span>
                </div>

                <!-- Add to Cart Button -->
                <button
                  (click)="addToCart(product)"
                  [disabled]="!product.inStock"
                  class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (product.inStock) {
                    Add to Cart
                  } @else {
                    Out of Stock
                  }
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Empty State -->
        @if (filteredProducts().length === 0) {
          <div class="text-center py-12">
            <p class="text-gray-600 text-lg">No products found matching your search.</p>
          </div>
        }
      }
    </div>
  `,
    styles: [],
})
export class ProductListComponent implements OnInit {
    private productStore = inject(ProductStore);
    private cartStore = inject(CartStore);

    loading = this.productStore.loading;
    filteredProducts = this.productStore.filteredProducts;
    productCount = this.productStore.productCount;

    searchTerm = '';

    ngOnInit() {
        this.loadMockProducts();
    }

    onSearchChange(term: string) {
        this.productStore.setFilter(term);
    }

    addToCart(product: Product) {
        this.cartStore.addItem({
            productId: product.id,
            productName: product.name,
            quantity: 1,
            price: product.price,
            image: product.image,
        });
    }

    private loadMockProducts() {
        this.productStore.setLoading(true);

        // Mock products for demo
        const mockProducts: Product[] = [
            {
                id: '1',
                name: 'Wireless Headphones',
                description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
                price: 299.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
                category: 'Electronics',
                inStock: true,
            },
            {
                id: '2',
                name: 'Smart Watch',
                description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
                price: 399.99,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                category: 'Electronics',
                inStock: true,
            },
            {
                id: '3',
                name: 'Laptop Backpack',
                description: 'Durable water-resistant backpack with padded laptop compartment',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
                category: 'Accessories',
                inStock: true,
            },
            {
                id: '4',
                name: 'Mechanical Keyboard',
                description: 'RGB mechanical gaming keyboard with customizable switches',
                price: 149.99,
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
                category: 'Electronics',
                inStock: false,
            },
            {
                id: '5',
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with precision tracking',
                price: 49.99,
                image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
                category: 'Electronics',
                inStock: true,
            },
            {
                id: '6',
                name: 'USB-C Hub',
                description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
                price: 59.99,
                image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
                category: 'Accessories',
                inStock: true,
            },
        ];

        setTimeout(() => {
            this.productStore.loadProducts(mockProducts);
        }, 500);
    }
}
