'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Search,
    Filter,
    Sparkles,
    LayoutGrid,
    ArrowUpDown,
    Loader2
} from 'lucide-react';
import ProductCard from '@/components/product-card';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    rating: number;
    totalReviews: number;
    stock: number;
}

const CATEGORIES = ['Templates', 'Icons', 'UI Kits', 'Fonts', 'Themes', 'Other'];

function MarketplaceContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    async function fetchProducts() {
        setLoading(true);
        try {
            const params = new URLSearchParams(searchParams.toString());
            // Ensure sort is passed
            if (!params.has('sort')) params.set('sort', 'newest');

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();

            if (res.ok) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const updateFilters = (newParams: any) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.keys(newParams).forEach(key => {
            if (newParams[key] !== null && newParams[key] !== undefined && newParams[key] !== '') {
                params.set(key, newParams[key]);
            } else {
                params.delete(key);
            }
        });

        if (!newParams.page) params.set('page', '1');
        router.push(`/products?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ search });
    };

    const handleCategoryChange = (category: string) => {
        const newCat = selectedCategory === category ? 'all' : category;
        setSelectedCategory(newCat);
        updateFilters({ category: newCat === 'all' ? null : newCat });
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        updateFilters({ sort: value });
    };

    const FilterContent = () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4">Categories</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 group">
                        <Checkbox
                            id="cat-all"
                            checked={selectedCategory === 'all'}
                            onCheckedChange={() => handleCategoryChange('all')}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="cat-all" className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors">All Assets</Label>
                    </div>
                    {CATEGORIES.map(cat => (
                        <div key={cat} className="flex items-center space-x-3 group">
                            <Checkbox
                                id={`cat-${cat}`}
                                checked={selectedCategory === cat}
                                onCheckedChange={() => handleCategoryChange(cat)}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <Label htmlFor={`cat-${cat}`} className="text-sm font-medium cursor-pointer capitalize group-hover:text-primary transition-colors">{cat}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="bg-border/40" />

            <div>
                <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4">Price Range</h3>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                        <Input
                            type="number"
                            placeholder="0"
                            className="h-9 pl-6 bg-background/50 focus:bg-background transition-colors"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            onBlur={() => updateFilters({ minPrice: priceRange[0], maxPrice: priceRange[1] })}
                        />
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            className="h-9 pl-6 bg-background/50 focus:bg-background transition-colors"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            onBlur={() => updateFilters({ minPrice: priceRange[0], maxPrice: priceRange[1] })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative border-b bg-muted/20 pb-20 pt-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background z-0" />
                <div className="absolute top-0 right-1/4 p-32 bg-primary/10 blur-[120px] rounded-full opacity-60" />
                <div className="absolute bottom-0 left-1/4 p-32 bg-purple-500/10 blur-[120px] rounded-full opacity-60" />

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <div className="inline-flex items-center rounded-full border bg-background/80 px-4 py-1.5 text-sm font-medium backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                        <Sparkles className="mr-2 h-4 w-4 text-primary" />
                        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">New:</span>
                        <span className="ml-1">Premium 3D Icon Packs available now</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 max-w-4xl mx-auto leading-tight">
                        The Marketplace for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Digital Creators.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 leading-relaxed">
                        Discover thousands of high-quality templates, icons, and UI kits to accelerate your design workflow.
                    </p>

                    <div className="max-w-xl mx-auto relative animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
                        <div className="relative group">
                            <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="search"
                                placeholder="'Icons'"
                                className="pl-12 h-14 rounded-full shadow-2xl shadow-primary/10 border-muted/40 bg-background/90 backdrop-blur-xl focus-visible:ring-primary/30 text-lg transition-all hover:shadow-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                            <Button
                                className="absolute right-2 top-2 h-10 rounded-full px-6 font-semibold"
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Desktop Sidebar */}
                    <aside className="w-72 hidden lg:block shrink-0 sticky top-28 h-fit">
                        <div className="rounded-2xl border bg-card/40 backdrop-blur-sm p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <Filter className="h-4 w-4 text-primary" />
                                <h2 className="font-bold text-lg">Filters</h2>
                            </div>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <LayoutGrid className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        {selectedCategory === 'all' ? 'All Assets' : selectedCategory}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Showing {products.length} result{products.length !== 1 && 's'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Mobile Filter Trigger */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="lg:hidden rounded-full">
                                            <Filter className="h-4 w-4 mr-2" />
                                            Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left">
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                            <SheetDescription>Refine your product search</SheetDescription>
                                        </SheetHeader>
                                        <div className="mt-8">
                                            <FilterContent />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground hidden sm:inline-block">Sort by:</span>
                                    <Select value={sort} onValueChange={handleSortChange}>
                                        <SelectTrigger className="w-[180px] rounded-full border-muted-foreground/20">
                                            <ArrowUpDown className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <SelectValue placeholder="Sort order" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">Newest Arrivals</SelectItem>
                                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                            {/* Add more sorts if backend supports (e.g. rating) */}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-[400px] rounded-xl bg-muted/40 animate-pulse" />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 hover:auto-rows-fr">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center rounded-3xl border bg-muted/5 border-dashed">
                                <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                                    <Search className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="font-bold text-2xl mb-2">No products found</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
                                    We couldn't find any assets matching your search. Try adjusting your filters or search terms.
                                </p>
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        setSearch('');
                                        setSelectedCategory('all');
                                        router.push('/products');
                                    }}
                                    className="rounded-full shadow-lg shadow-primary/20"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MarketplacePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <MarketplaceContent />
        </Suspense>
    );
}
