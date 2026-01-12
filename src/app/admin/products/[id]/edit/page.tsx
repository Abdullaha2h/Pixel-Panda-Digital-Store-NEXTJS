'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/product-form';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation'; // Correct hook for App router params in client component? 
// Actually in Page components, params is a prop. But let's use unwrapped params to be safe or use hook.
// In Next.js 15, params is a promise.
import React from 'react';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    // Need to unwrap params
    const resolvedParams = React.use(params);
    const id = resolvedParams.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setProduct(data.product);
                }
            } catch (error) {
                console.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                <p className="text-muted-foreground">Update product details</p>
            </div>
            <ProductForm initialData={product} isEdit={true} productId={id} />
        </div>
    );
}
