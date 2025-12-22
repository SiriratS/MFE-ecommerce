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
    <div class="bg-neutral-50 min-h-screen">
      <div class="container-custom py-12">
        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-4xl font-semibold text-neutral-900 mb-3">Shop All Products</h1>
          <p class="text-neutral-600 text-lg">Discover our curated collection</p>
        </div>
        
        <!-- Search/Filter Bar -->
        <div class="mb-10">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <input
              type="search"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Search products..."
              class="flex-1 max-w-md px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
            <div class="text-neutral-600 text-sm">
              {{ productCount() }} {{ productCount() === 1 ? 'product' : 'products' }}
            </div>
          </div>
        </div>

        <!-- Loading State -->
        @if (loading()) {
          <div class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
            <p class="mt-4 text-neutral-600">Loading products...</p>
          </div>
        }

        <!-- Product Grid -->
        @if (!loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of filteredProducts(); track product.id) {
              <div class="group bg-white rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-md">
                <!-- Product Image -->
                <div class="relative overflow-hidden bg-neutral-100 aspect-square">
                  <img
                    [src]="product.image"
                    [alt]="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  @if (!product.inStock) {
                    <div class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                      <span class="text-neutral-600 font-medium text-sm">Out of Stock</span>
                    </div>
                  }
                  <!-- Category Badge -->
                  <div class="absolute top-3 left-3">
                    <span class="text-xs bg-white text-neutral-700 px-3 py-1 rounded-full font-medium shadow-sm">
                      {{ product.category }}
                    </span>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="p-5">
                  <h3 class="text-base font-medium text-neutral-900 mb-2 line-clamp-2 min-h-[3rem]">
                    {{ product.name }}
                  </h3>
                  
                  <p class="text-sm text-neutral-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {{ product.description }}
                  </p>

                  <div class="flex items-center justify-between mb-4">
                    <span class="text-2xl font-semibold text-neutral-900">
                      \${{ product.price.toFixed(2) }}
                    </span>
                  </div>

                  <!-- Add to Cart Button -->
                  <button
                    (click)="addToCart(product)"
                    [disabled]="!product.inStock"
                    class="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm"
                    [ngClass]="product.inStock 
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800' 
                      : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'"
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
            <div class="text-center py-20">
              <div class="text-neutral-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p class="text-neutral-600 text-lg">No products found matching your search</p>
              <p class="text-neutral-500 text-sm mt-2">Try adjusting your search terms</p>
            </div>
          }
        }
      </div>
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
