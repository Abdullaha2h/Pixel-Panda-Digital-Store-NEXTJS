'use client';

import ProductForm from '@/components/admin/product-form';

export default function NewProductPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
                <p className="text-muted-foreground">Add a new item to your marketplace</p>
            </div>
            <ProductForm />
        </div>
    );
}
