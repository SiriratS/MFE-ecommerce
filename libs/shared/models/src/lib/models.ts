export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
}

export interface CartItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    createdAt: Date;
}
