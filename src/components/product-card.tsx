'use client';

import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        category: string;
        images: string[];
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const mainImage = product.images?.[0] || 'https://ulbcqotmtnzedaimvqvj.storage.supabase.co/storage/v1/s3';
    const { items, addItem, updateQuantity, removeItem } = useCart();
    const inCartItem = items.find(i => i._id === product._id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: mainImage,
            category: product.category,
        });
    };

    return (
        <Link href={`/products/${product._id}`} className="block group w-full">
            <div className="relative w-full overflow-hidden rounded-xl border border-border/40 bg-card/40 backdrop-blur-md transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-0.5">
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-muted/20 mt-0 pt-0">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Action Buttons - Bottom Right */}
                    <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5">
                        {inCartItem ? (
                            <div className="flex items-center bg-primary text-white rounded-full shadow-lg overflow-hidden h-8" onClick={(e) => e.preventDefault()}>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (inCartItem.quantity === 1) {
                                            removeItem(product._id);
                                        } else {
                                            updateQuantity(product._id, -1);
                                        }
                                    }}
                                    className="h-full px-2 hover:bg-black/10 active:scale-95 transition-all flex items-center justify-center border-r border-white/10"
                                >
                                    {inCartItem.quantity === 1 ? (
                                        <X className="h-3 w-3 stroke-[3px]" />
                                    ) : (
                                        <Minus className="h-3 w-3 stroke-[3px]" />
                                    )}
                                </button>
                                <span className="text-[10px] font-black px-1.5 min-w-5 text-center">
                                    {inCartItem.quantity}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        updateQuantity(product._id, 1);
                                    }}
                                    className="h-full px-2 hover:bg-black/10 active:scale-95 transition-all flex items-center justify-center border-l border-white/10"
                                >
                                    <Plus className="h-3 w-3 stroke-[3px]" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="h-8 w-8 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 hover:bg-primary/90 active:scale-95 transition-all"
                                title="Add to Cart"
                            >
                                <Plus className="h-4 w-4 stroke-[2.5px]" />
                            </button>
                        )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 z-10">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-md text-[8px] uppercase tracking-wider px-1.5 py-0 font-bold border-border/50 h-4 flex items-center">
                            {product.category}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="px-2.5 pt-1.5 pb-2.5 space-y-0.5">
                    <h3 className="font-bold text-xs leading-tight text-foreground truncate group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-black text-primary">
                            ${product.price.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
