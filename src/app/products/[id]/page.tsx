import React from 'react';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/product-details-client';
import { isValidObjectId } from 'mongoose';


export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Validate MongoDB ObjectId format
    if (!isValidObjectId(id)) {
        console.error('Invalid product ID format:', id);
        return notFound();
    }

    try {
        await dbConnect();

        // Ensure User model is registered (Mongoose population requirement)
        if (!User) console.log('User model loading...');

        // Find product and populate creator info
        // We use lean() to get a plain JS object, which is better for RSC -> Client components
        const productData = await Product.findById(id)
            .populate('createdBy', 'name email')
            .lean();

        if (!productData) {
            console.log(`[ProductDetails] Product not found: ${id}`);
            return notFound();
        }

        // Serialization fix for MongoDB objects
        const product = JSON.parse(JSON.stringify(productData));

        return <ProductDetailsClient product={product} />;
    } catch (error: any) {
        console.error(`[ProductDetails] Error fetching product ${id}:`, error);
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="max-w-md mx-auto p-8 rounded-3xl border border-destructive/20 bg-destructive/5 backdrop-blur-md">
                    <h1 className="text-2xl font-bold text-destructive mb-2">Something went wrong</h1>
                    <p className="text-muted-foreground mb-6">
                        We couldn't load the product information. This might be due to a database connection issue.
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="text-left bg-black/5 p-4 rounded-xl overflow-auto mb-6">
                            <code className="text-xs text-destructive-foreground">
                                {error.message || 'Unknown error'}
                            </code>
                        </div>
                    )}
                    <Link
                        href="/products"
                        className="inline-block px-6 py-2 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-opacity"
                    >
                        Return to Marketplace
                    </Link>
                </div>
            </div>
        );
    }
}
