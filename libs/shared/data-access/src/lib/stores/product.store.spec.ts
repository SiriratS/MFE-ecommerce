import { TestBed } from '@angular/core/testing';
import { ProductStore } from './product.store';
import { Product } from '@ecommerce-platform/shared/models';

describe('ProductStore', () => {
    let store: InstanceType<typeof ProductStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProductStore],
        });
        store = TestBed.inject(ProductStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    it('should initialize with empty products', () => {
        expect(store.products()).toEqual([]);
        expect(store.loading()).toBe(false);
        expect(store.productCount()).toBe(0);
    });

    it('should load products', () => {
        const mockProducts: Product[] = [
            {
                id: '1',
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                image: 'test.jpg',
                category: 'Test',
                inStock: true,
            },
        ];

        store.loadProducts(mockProducts);

        expect(store.products()).toEqual(mockProducts);
        expect(store.productCount()).toBe(1);
        expect(store.loading()).toBe(false);
    });

    it('should filter products by name', () => {
        const mockProducts: Product[] = [
            {
                id: '1',
                name: 'Laptop',
                description: 'Test',
                price: 999,
                image: 'test.jpg',
                category: 'Electronics',
                inStock: true,
            },
            {
                id: '2',
                name: 'Mouse',
                description: 'Test',
                price: 29,
                image: 'test.jpg',
                category: 'Electronics',
                inStock: true,
            },
        ];

        store.loadProducts(mockProducts);
        store.setFilter('laptop');

        expect(store.filteredProducts().length).toBe(1);
        expect(store.filteredProducts()[0].name).toBe('Laptop');
    });

    it('should filter products by category', () => {
        const mockProducts: Product[] = [
            {
                id: '1',
                name: 'Laptop',
                description: 'Test',
                price: 999,
                image: 'test.jpg',
                category: 'Electronics',
                inStock: true,
            },
            {
                id: '2',
                name: 'Shirt',
                description: 'Test',
                price: 29,
                image: 'test.jpg',
                category: 'Clothing',
                inStock: true,
            },
        ];

        store.loadProducts(mockProducts);
        store.setFilter('clothing');

        expect(store.filteredProducts().length).toBe(1);
        expect(store.filteredProducts()[0].category).toBe('Clothing');
    });

    it('should set loading state', () => {
        store.setLoading(true);
        expect(store.loading()).toBe(true);

        store.setLoading(false);
        expect(store.loading()).toBe(false);
    });

    it('should select a product', () => {
        const mockProduct: Product = {
            id: '1',
            name: 'Test Product',
            description: 'Test',
            price: 99.99,
            image: 'test.jpg',
            category: 'Test',
            inStock: true,
        };

        store.selectProduct(mockProduct);
        expect(store.selectedProduct()).toEqual(mockProduct);

        store.selectProduct(null);
        expect(store.selectedProduct()).toBeNull();
    });
});
