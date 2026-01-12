import React from 'react';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product-card';
import FilterSidebar from '@/components/filter-sidebar';

const validCategories = ['mockups', 'templates', 'vectors', 'all', 'ui kits', 'fonts', 'themes', 'other'];

async function getProductsData(category: string, search?: string, minPrice?: string, maxPrice?: string) {
    try {
        await dbConnect();

        let query: any = { isActive: true };

        // Category filtering (multi-select support)
        if (category && category !== 'all') {
            const categories = category.split(',');
            if (categories.length > 1) {
                query.category = { $in: categories.map(c => new RegExp(`^${c}$`, 'i')) };
            } else {
                const formattedCat = category.replace(/-/g, ' ');
                query.category = { $regex: new RegExp(`^${formattedCat}$|^${category}$`, 'i') };
            }
        }

        // Search filtering (Name OR Category)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Price filtering
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error('Database error in CategoryPage:', error);
        return [];
    }
}

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ search?: string, minPrice?: string, maxPrice?: string, category?: string }>
}) {
    const { slug } = await params;
    const { search, minPrice, maxPrice, category: categoryParam } = await searchParams;

    const decodedSlug = decodeURIComponent(slug).toLowerCase();

    const products = await getProductsData(categoryParam || decodedSlug, search, minPrice, maxPrice);

    return (
        <div className="container max-w-7xl mx-auto px-4 pt-8 pb-20 min-h-screen text-foreground">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-8 mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter">
                        {search ? `Search results` : (decodedSlug === 'all' ? 'All Assets' : decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1))}
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-md">
                        {search
                            ? `Showing results for "${search}" in ${decodedSlug === 'all' ? 'all categories' : decodedSlug}.`
                            : `Explore our collection of premium ${decodedSlug === 'all' ? 'digital assets' : decodedSlug}. Hand-picked for quality.`
                        }
                    </p>
                </div>

                {/* Right Aligned Area */}
                <div className="flex items-center gap-3">
                    <form className="relative w-72 hidden md:block" action={`/category/${slug}`} method="GET">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            name="search"
                            defaultValue={search}
                            placeholder="Search in this view..."
                            className="pl-9 h-11 text-sm rounded-xl bg-muted/20 border-border/40 focus-visible:ring-primary/20"
                        />
                    </form>

                    {/* Mobile Filter Trigger */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 h-11 rounded-xl border-border/40 px-4">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px]">
                                <SheetHeader className="text-left mb-6">
                                    <SheetTitle className="text-lg font-bold">Filter Assets</SheetTitle>
                                    <SheetDescription className="text-xs">
                                        Refine your search with price and category filters.
                                    </SheetDescription>
                                </SheetHeader>
                                <FilterSidebar currentCategory={decodedSlug} />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar - Vertically defined with border */}
                <aside className="w-full lg:w-64 shrink-0 hidden lg:block pr-8 border-r border-border/40">
                    <div className="sticky top-28 space-y-8">
                        <FilterSidebar currentCategory={decodedSlug} />
                    </div>
                </aside>

                {/* Grid Content - Higher density */}
                <div className="flex-1">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                            {products.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/5 border-border/20">
                            <div className="max-w-md mx-auto space-y-4">
                                <p className="text-xl font-bold">No assets found</p>
                                <p className="text-muted-foreground text-sm">
                                    We couldn't find anything matching your current filters. Try resetting or searching for something else.
                                </p>
                                <Button variant="secondary" size="sm" asChild className="rounded-full px-6">
                                    <a href="/category/all">View all assets</a>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
