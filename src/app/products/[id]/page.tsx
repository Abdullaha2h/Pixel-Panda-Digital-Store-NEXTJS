import React from 'react';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/product-details-client';


export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        await dbConnect();
        // Plain object for the client component
        const productData = await Product.findById(id).populate('createdBy', 'name email').lean();

        if (!productData) {
            return notFound();
        }

        // Convert MongoDB IDs to strings for the client component
        const product = JSON.parse(JSON.stringify(productData));

        return <ProductDetailsClient product={product} />;
    } catch (error) {
        console.error('Error in ProductDetailsPage:', error);
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="text-muted-foreground mt-2">We couldn't load the product information.</p>
            </div>
        );
    }
}
