'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const CATEGORIES = [
    'Mockups',
    'Templates',
    'Vectors',
    'UI Kits',
    'Fonts',
    'Themes',
];

export default function FilterSidebar({ currentCategory }: { currentCategory?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isAll, setIsAll] = useState(false);

    // Initialize from URL
    useEffect(() => {
        const min = searchParams.get('minPrice');
        const max = searchParams.get('maxPrice');
        if (min && max) {
            setPriceRange([parseInt(min), parseInt(max)]);
        }

        const catParam = searchParams.get('category');
        let cats: string[] = [];

        if (catParam) {
            cats = catParam.split(',').map(c =>
                c.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            );
            if (cats.length === CATEGORIES.length) {
                setIsAll(true);
            } else {
                setIsAll(false);
            }
        } else if (currentCategory && currentCategory !== 'all') {
            const formatted = currentCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            cats = [formatted];
            setIsAll(false);
        } else {
            setIsAll(true);
            cats = []; // If isAll is true, params might be empty
        }

        setSelectedCategories(cats);
    }, [searchParams, currentCategory]);

    const updateURL = useCallback((newRange: number[], newCats: string[], all: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('minPrice', newRange[0].toString());
        params.set('maxPrice', newRange[1].toString());

        if (all || newCats.length === CATEGORIES.length || newCats.length === 0) {
            params.delete('category');
            router.push(`/category/all?${params.toString()}`, { scroll: false });
        } else {
            const catSlugs = newCats.map(c => c.toLowerCase().replace(/\s+/g, '-')).join(',');
            params.set('category', catSlugs);
            router.push(`/category/all?${params.toString()}`, { scroll: false });
        }
    }, [router, searchParams]);

    const handleAllChange = (checked: boolean) => {
        setIsAll(checked);
        if (checked) {
            setSelectedCategories(CATEGORIES);
            updateURL(priceRange, CATEGORIES, true);
        } else {
            setSelectedCategories([]);
            updateURL(priceRange, [], false);
        }
    };

    const handleCategoryChange = (category: string, checked: boolean) => {
        let nextCats: string[];

        if (checked) {
            nextCats = [...selectedCategories, category];
            if (nextCats.length === CATEGORIES.length) {
                setIsAll(true);
            }
        } else {
            nextCats = selectedCategories.filter(c => c !== category);
            setIsAll(false);
        }

        setSelectedCategories(nextCats);
        updateURL(priceRange, nextCats, nextCats.length === CATEGORIES.length && nextCats.length > 0);
    };

    const onPriceChange = (value: number[]) => {
        setPriceRange(value);
    };

    const onPriceCommit = (value: number[]) => {
        updateURL(value, selectedCategories, isAll);
    };

    const clearFilters = () => {
        router.push('/category/all', { scroll: false });
    };

    return (
        <div className="space-y-6 h-full">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-base tracking-tight">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-7 px-2 text-xs hover:bg-transparent hover:text-primary">
                    Reset
                </Button>
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categories</Label>
                <div className="space-y-2.5">
                    <div className="flex items-center space-x-2.5 group">
                        <Checkbox
                            id="cat-all"
                            checked={isAll}
                            onCheckedChange={handleAllChange}
                            className="h-4 w-4 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label
                            htmlFor="cat-all"
                            className="text-sm font-semibold leading-none cursor-pointer group-hover:text-primary transition-colors"
                        >
                            All Assets
                        </Label>
                    </div>

                    <Separator className="my-1 opacity-20" />

                    {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2.5 group">
                            <Checkbox
                                id={`cat-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={(checked: boolean) => handleCategoryChange(category, checked)}
                                className="h-4 w-4 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <Label
                                htmlFor={`cat-${category}`}
                                className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors text-foreground/80 data-[selected=true]:text-primary data-[selected=true]:font-bold"
                                data-selected={selectedCategories.includes(category)}
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price Range</Label>
                    <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                        ${priceRange[0]} - ${priceRange[1]}
                    </span>
                </div>
                <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={onPriceChange}
                    onValueCommit={onPriceCommit}
                    className="py-2"
                />
                <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                        <span className="text-[9px] text-muted-foreground uppercase font-bold ml-0.5">Min</span>
                        <div className="h-8 w-full rounded-lg border border-border/50 bg-muted/20 px-2 py-1 text-xs font-mono font-bold flex items-center">
                            ${priceRange[0]}
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <span className="text-[9px] text-muted-foreground uppercase font-bold ml-0.5">Max</span>
                        <div className="h-8 w-full rounded-lg border border-border/50 bg-muted/20 px-2 py-1 text-xs font-mono font-bold flex items-center">
                            ${priceRange[1]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
