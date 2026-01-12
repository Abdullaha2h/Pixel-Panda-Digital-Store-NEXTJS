'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Separator } from '@/components/ui/separator';

export default function CartSidebar({ children }: { children: React.ReactNode }) {
    const { items, removeItem, total, count, updateQuantity } = useCart();

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0">
                <SheetHeader className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            Your Cart
                            {count > 0 && (
                                <span className="text-xs font-normal text-muted-foreground">
                                    ({count} {count === 1 ? 'item' : 'items'})
                                </span>
                            )}
                        </SheetTitle>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                            <div className="relative w-48 h-48 opacity-80">
                                <Image
                                    src="/empty_cart.svg"
                                    alt="Empty Cart"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Your cart is empty</h3>
                                <p className="text-muted-foreground text-sm max-w-[250px]">
                                    Looks like you haven't added any premium assets to your collection yet.
                                </p>
                            </div>
                            <SheetTrigger asChild>
                                <Link href="/category/all">
                                    <Button className="rounded-full px-8">
                                        Browse Marketplace
                                    </Button>
                                </Link>
                            </SheetTrigger>
                        </div>
                    ) : (
                        <div className="h-full p-6">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item._id} className="flex gap-4 group">
                                        <div className="relative h-20 w-20 flex-none rounded-lg overflow-hidden border bg-muted">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0 py-1">
                                            <div className="flex justify-between gap-2 mb-1">
                                                <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                                    {item.name}
                                                </h4>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeItem(item._id);
                                                    }}
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-auto">{item.category}</p>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border rounded-lg bg-muted/50 overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            if (item.quantity === 1) {
                                                                removeItem(item._id);
                                                            } else {
                                                                updateQuantity(item._id, -1);
                                                            }
                                                        }}
                                                        className="p-1 px-2 hover:bg-background transition-colors border-r"
                                                    >
                                                        {item.quantity === 1 ? (
                                                            <X className="h-3 w-3 text-destructive" />
                                                        ) : (
                                                            <Minus className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, 1)}
                                                        className="p-1 px-2 hover:bg-background transition-colors border-l"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-sm text-primary">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="p-6 border-t bg-muted/20 sm:flex-col gap-4">
                        <div className="space-y-1.5 w-full">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Transaction Fee</span>
                                <span className="text-green-600 font-medium">FREE</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-lg text-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 w-full">
                            <Link href="/cart" className="w-full">
                                <Button className="w-full h-12 rounded-xl font-bold group" size="lg">
                                    Checkout Now
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    Continue Shopping
                                </Button>
                            </SheetTrigger>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
