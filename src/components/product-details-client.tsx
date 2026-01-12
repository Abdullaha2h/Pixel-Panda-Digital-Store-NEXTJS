'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Share2, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export default function ProductDetailsClient({ product }: { product: any }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || 'https://ulbcqotmtnzedaimvqvj.storage.supabase.co/storage/v1/s3',
            category: product.category,
        });
    };

    return (
        <div className="container mx-auto px-4 pt-12 pb-24 min-h-screen text-foreground">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Images */}
                <div className="space-y-4">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border bg-muted/20">
                        <Image
                            src={product.images?.[selectedImage] || 'https://ulbcqotmtnzedaimvqvj.storage.supabase.co/storage/v1/s3'}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {product.images?.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative aspect-video w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === idx ? 'border-primary' : 'border-border/50 hover:border-primary/50'}`}
                                >
                                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="secondary" className="rounded-full px-3 bg-primary/10 text-primary border-primary/20">{product.category}</Badge>
                            <div className="flex items-center text-yellow-500 text-sm font-bold">
                                <Star className="h-4 w-4 fill-current mr-1" />
                                {product.rating || 5.0} <span className="text-muted-foreground ml-1 font-normal">({product.totalReviews || 0} reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-3">{product.name}</h1>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                            {product.description || "Premium digital asset designed for professional use. High quality, fully editable, and ready for your next project."}
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/5 border border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary uppercase">
                                {product.createdBy?.name ? product.createdBy.name[0] : 'P'}
                            </div>
                            <div>
                                <p className="font-bold text-sm flex items-center gap-1">
                                    {product.createdBy?.name || 'PixelPanda Studio'}
                                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Verified Contributor</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs font-bold">View Profile</Button>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-end gap-3">
                            <div className="text-4xl font-bold text-primary">${product.price?.toFixed(2) || '0.00'}</div>
                            <div className="text-[10px] text-muted-foreground mb-2 font-bold uppercase tracking-widest">Single Use License</div>
                        </div>

                        <div className="flex gap-3">
                            <Button size="lg" className="flex-1 h-14 text-base font-bold rounded-2xl shadow-xl shadow-primary/20" onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 w-14 rounded-2xl border-border/50 hover:bg-card">
                                <Heart className="h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="ghost" className="h-14 w-14 rounded-2xl text-muted-foreground">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/10">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Asset Features</h3>
                        <ul className="grid grid-cols-2 gap-3">
                            {(product.features?.length > 0 ? product.features : ["High Resolution", "Easy to Edit", "Layered Files", "Commercial Use"]).map((feature: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                                    <Zap className="h-3.5 w-3.5 text-primary" /> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
