'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface CartItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    updateQuantity: (id: string, delta: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    total: number;
    count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                // Sanitize: Ensure every item has a valid quantity
                const sanitized = parsed.map((item: any) => ({
                    ...item,
                    quantity: typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 1
                }));
                setItems(sanitized);
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        const existing = items.find((i) => i._id === item._id);
        if (existing) {
            toast.success(`Increased ${item.name} quantity`);
        } else {
            toast.success("Added to cart");
        }

        setItems((prev) => {
            const isExisting = prev.find((i) => i._id === item._id);
            if (isExisting) {
                return prev.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) => {
            return prev.map((item) => {
                if (item._id === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item._id !== id));
        toast.info("Removed from cart");
    };

    const clearCart = () => {
        setItems([]);
        toast.success("Cart cleared");
    };

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total, count }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
