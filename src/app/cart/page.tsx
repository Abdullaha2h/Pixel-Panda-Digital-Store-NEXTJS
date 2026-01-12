'use client';

import React from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowRight, CreditCard, Plus, Minus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeItem, total, clearCart, updateQuantity, count } = useCart();
    const taxRate = 0.10; // 10% tax
    const taxAmount = total * taxRate;
    const grandTotal = total + taxAmount;

    if (items.length === 0) {
        return (
            <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-4">
                <div className="relative w-48 h-48 mb-4 opacity-80">
                    <Image
                        src="/empty_cart.svg"
                        alt="Empty Cart"
                        fill
                        className="object-contain"
                    />
                </div>
                <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Explore our premium marketplace to find the perfect assets.
                </p>
                <Link href="/category/all">
                    <Button size="sm" className="gap-2 rounded-full px-6 h-10">
                        Start Shopping <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="py-12 px-4 bg-muted/30">
            <div className="container max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black flex items-center gap-2">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                        Your Shopping Cart
                    </h1>
                    <span className="text-muted-foreground font-bold">({count} items)</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Items Section */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item._id} className="flex gap-6 p-6 rounded-2xl bg-card border border-border shadow-sm group">
                                    <div className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0 bg-muted">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-bold text-primary mb-1">{item.category}</p>
                                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                                            </div>
                                            <div className="font-black text-xl text-primary">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                                                <button
                                                    onClick={() => item.quantity === 1 ? removeItem(item._id) : updateQuantity(item._id, -1)}
                                                    className="p-2 hover:bg-muted transition-colors border-r"
                                                >
                                                    {item.quantity === 1 ? <Trash2 className="h-4 w-4 text-destructive" /> : <Minus className="h-4 w-4" />}
                                                </button>
                                                <span className="px-4 font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                    className="p-2 hover:bg-muted transition-colors border-l"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-white hover:bg-destructive"
                                                onClick={() => removeItem(item._id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t">
                            <Link href="/category/all">
                                <Button variant="ghost" className="gap-2 font-bold group">
                                    <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" /> Back to Market
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="text-destructive border-destructive/20 hover:bg-destructive hover:text-white"
                                onClick={clearCart}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-card border border-border p-8 rounded-3xl shadow-xl">
                            <h2 className="text-2xl font-black mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground font-medium">Subtotal</span>
                                    <span className="font-bold">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground font-medium">Tax</span>
                                    <span className="font-bold">${taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-border my-4" />
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-black">Total</span>
                                    <span className="text-3xl font-black text-primary">${grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button className="w-full h-14 text-lg font-black rounded-2xl shadow-lg shadow-primary/20 group">
                                Checkout Now
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>

                            <div className="mt-6 flex flex-col gap-4">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 p-4 rounded-xl">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-bold text-foreground">Secure Checkout</p>
                                        <p>Fast, encrypted payments.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
