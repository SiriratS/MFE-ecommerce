import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart.store';
import { CartItem } from '@ecommerce-platform/shared/models';

describe('CartStore', () => {
    let store: InstanceType<typeof CartStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CartStore],
        });
        store = TestBed.inject(CartStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    it('should initialize with empty cart', () => {
        expect(store.items()).toEqual([]);
        expect(store.totalItems()).toBe(0);
        expect(store.totalPrice()).toBe(0);
        expect(store.isEmpty()).toBe(true);
    });

    it('should add item to cart', () => {
        const item: CartItem = {
            productId: '1',
            productName: 'Test Product',
            quantity: 1,
            price: 99.99,
            image: 'test.jpg',
        };

        store.addItem(item);

        expect(store.items().length).toBe(1);
        expect(store.totalItems()).toBe(1);
        expect(store.totalPrice()).toBe(99.99);
        expect(store.isEmpty()).toBe(false);
    });

    it('should increase quantity when adding existing item', () => {
        const item: CartItem = {
            productId: '1',
            productName: 'Test Product',
            quantity: 1,
            price: 99.99,
            image: 'test.jpg',
        };

        store.addItem(item);
        store.addItem(item);

        expect(store.items().length).toBe(1);
        expect(store.items()[0].quantity).toBe(2);
        expect(store.totalItems()).toBe(2);
        expect(store.totalPrice()).toBe(199.98);
    });

    it('should remove item from cart', () => {
        const item: CartItem = {
            productId: '1',
            productName: 'Test Product',
            quantity: 1,
            price: 99.99,
            image: 'test.jpg',
        };

        store.addItem(item);
        store.removeItem('1');

        expect(store.items().length).toBe(0);
        expect(store.isEmpty()).toBe(true);
    });

    it('should update item quantity', () => {
        const item: CartItem = {
            productId: '1',
            productName: 'Test Product',
            quantity: 1,
            price: 99.99,
            image: 'test.jpg',
        };

        store.addItem(item);
        store.updateQuantity('1', 5);

        expect(store.items()[0].quantity).toBe(5);
        expect(store.totalItems()).toBe(5);
        expect(store.totalPrice()).toBe(499.95);
    });

    it('should remove item when quantity is 0', () => {
        const item: CartItem = {
            productId: '1',
            productName: 'Test Product',
            quantity: 1,
            price: 99.99,
            image: 'test.jpg',
        };

        store.addItem(item);
        store.updateQuantity('1', 0);

        expect(store.items().length).toBe(0);
    });

    it('should clear cart', () => {
        const item1: CartItem = {
            productId: '1',
            productName: 'Product 1',
            quantity: 1,
            price: 99.99,
            image: 'test.jpg',
        };
        const item2: CartItem = {
            productId: '2',
            productName: 'Product 2',
            quantity: 2,
            price: 49.99,
            image: 'test.jpg',
        };

        store.addItem(item1);
        store.addItem(item2);
        store.clearCart();

        expect(store.items().length).toBe(0);
        expect(store.isEmpty()).toBe(true);
    });

    it('should calculate total price correctly with multiple items', () => {
        const item1: CartItem = {
            productId: '1',
            productName: 'Product 1',
            quantity: 2,
            price: 50,
            image: 'test.jpg',
        };
        const item2: CartItem = {
            productId: '2',
            productName: 'Product 2',
            quantity: 3,
            price: 30,
            image: 'test.jpg',
        };

        store.addItem(item1);
        store.addItem(item2);

        expect(store.totalItems()).toBe(5);
        expect(store.totalPrice()).toBe(190); // (2 * 50) + (3 * 30)
    });
});
