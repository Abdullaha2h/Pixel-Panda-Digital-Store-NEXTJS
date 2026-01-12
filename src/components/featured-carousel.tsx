'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './product-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeaturedCarouselProps {
    products: any[];
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
            return () => {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [products]);

    // Autoplay Loop Logic
    useEffect(() => {
        if (products.length <= 3 || isPaused) return;

        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

                // If we're at the end, loop back to the start
                if (scrollLeft >= scrollWidth - clientWidth - 10) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollContainerRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
                }
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [products, isPaused]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { clientWidth } = scrollContainerRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group/carousel px-0 md:max-w-[840px] max-w-60 mx-auto overflow-visible">
            {/* Navigation Arrows - Using functional variants and custom glass effect */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 md:-left-6 z-30 pointer-events-none transition-all duration-300">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll('left')}
                    className={cn(
                        "h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 backdrop-blur-md border-primary/20 shadow-lg pointer-events-auto transition-all active:scale-90",
                        !canScrollLeft ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                    )}
                >
                    <ChevronLeft className="h-5 w-5 text-primary" />
                </Button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 -right-3 md:-right-6 z-30 pointer-events-none transition-all duration-300">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll('right')}
                    className={cn(
                        "h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 backdrop-blur-md border-primary/20 shadow-lg pointer-events-auto transition-all active:scale-90",
                        !canScrollRight ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                    )}
                >
                    <ChevronRight className="h-5 w-5 text-primary" />
                </Button>
            </div>

            {/* Carousel Container - Clean, smooth snap scroll */}
            <div
                ref={scrollContainerRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 scroll-smooth"
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="flex-none w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] snap-start px-0.5"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Minimalist Indicator (Dots) - only shows if more than 3 items */}
            {products.length > 3 && (
                <div className="flex justify-center gap-1.5 mt-2 opacity-30">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <div className="h-1 w-1 rounded-full bg-primary" />
                </div>
            )}
        </div>
    );
}
