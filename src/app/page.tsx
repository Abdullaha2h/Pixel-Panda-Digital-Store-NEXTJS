'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Star, Zap, Diamond, Crown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import FeaturedCarousel from '@/components/featured-carousel';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPopping, setIsPopping] = useState(false);

  const handlePandaClick = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 300);
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products?featured=true&limit=9');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pl-20 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-primary/10 via-background to-background" />
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 pt-12 lg:pt-0 text-center lg:text-left pr-0 lg:pr-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                New Collection Available
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                Discover & Collect <br />
                <span className="text-primary italic">Exclusive</span> Digital Assets
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Pixel Panda is the premium marketplace for unique digital creations.
                Explore a world of limited edition assets from top creators.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link href="/category/all">
                  <Button size="lg" className="h-12 px-8 rounded-full shadow-lg shadow-primary/20">
                    Explore Market <ShoppingCart className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg" className="h-12 px-8 rounded-full">
                    Start Creating <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5 relative group">
              {/* Premium Glow Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-glow-pulse -z-10" />
              {/* Triple Layered Animation: Sway -> Breathe -> Interaction */}
              <div className="animate-panda-sway">
                <div className="animate-panda-breathe">
                  <div
                    className={`relative w-120 h-120 mx-auto cursor-pointer transition-all duration-700 ease-out 
                      group-hover:-translate-y-4 group-hover:scale-105 active:scale-95 hover:brightness-110
                      ${isPopping ? 'animate-pop' : ''}`}
                    onClick={handlePandaClick}
                  >
                    <Image
                      src="/hero.svg"
                      alt="Pixel Panda Mascot"
                      fill
                      priority
                      className="object-contain drop-shadow-[0_20px_50px_rgba(var(--primary),0.2)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Assets Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                Featured Masterpieces
              </h2>
              <p className="text-muted-foreground text-sm">Professional assets, hand-picked for quality.</p>
            </div>
            <Link href="/category/all">
              <Button variant="ghost" size="sm" className="group text-xs font-bold uppercase tracking-widest">
                View All <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <FeaturedCarousel products={featuredProducts} />
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
              <p className="text-muted-foreground">No featured masterpieces at the moment.</p>
              <Link href="/category/all" className="mt-4 inline-block">
                <Button variant="link">Browse the full marketplace</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "Get your digital assets instantly after purchase with zero wait time." },
              { icon: Diamond, title: "Premium Quality", desc: "All our assets are vetted by experts to ensure top-tier quality." },
              { icon: ShoppingCart, title: "Safe & Secure", desc: "Every transaction is protected by industry-leading security protocols." },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-2xl border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div className="p-4 rounded-full bg-primary/10 mb-6 text-primary">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to start your collection?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of collectors on Pixel Panda. <br /> Sign up now and discover your next favorite asset.
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-12 px-10 rounded-full shadow-xl shadow-primary/20">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
      <footer />
    </div>
  );
}
