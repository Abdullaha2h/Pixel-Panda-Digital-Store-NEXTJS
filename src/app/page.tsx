'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { ArrowRight, ShoppingCart, Star, Zap, Diamond, Crown, Loader2, Sparkles, Heart, Move } from 'lucide-react';
import Image from 'next/image';
import FeaturedCarousel from '@/components/featured-carousel';
import { useAuth } from '@/context/auth-context';

export default function Home() {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPopping, setIsPopping] = useState(false);

  // Hero Interaction State
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [showBlush, setShowBlush] = useState(false);

  // Physics refs
  const velocityRef = useRef(0);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const handlePandaClick = () => {
    setIsPopping(true);
    setShowBlush(true);
    setTimeout(() => setIsPopping(false), 300);
    setTimeout(() => setShowBlush(false), 2000); // Blush lasts 2s
  };

  const calculateAngle = (clientX: number, clientY: number) => {
    if (!imageRef.current) return 0;
    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    return angleRad * (180 / Math.PI);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    // Stop any existing inertia
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const startAngle = calculateAngle(e.clientX, e.clientY);
    lastAngleRef.current = startAngle;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentAngle = calculateAngle(e.clientX, e.clientY);

    // Handle wrap-around (e.g. crossing from 180 to -180)
    let delta = currentAngle - lastAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    // Update rotation
    setRotation(prev => prev + delta);

    // Calculate velocity (degrees per ms)
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      // Simple smoothing for velocity
      const instantaneousVelocity = delta / dt;
      velocityRef.current = instantaneousVelocity * 0.8 + velocityRef.current * 0.2;
    }

    lastAngleRef.current = currentAngle;
    lastTimeRef.current = now;
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // Start inertia loop
    const applyInertia = () => {
      if (Math.abs(velocityRef.current) < 0.01) {
        velocityRef.current = 0; // Stop
        return;
      }

      // Apply friction
      velocityRef.current *= 0.95; // Decay factor

      setRotation(prev => prev + velocityRef.current * 16); // * 16 for approx frame time scaling

      animationFrameRef.current = requestAnimationFrame(applyInertia);
    };
    applyInertia();
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
      <section className="relative md:pl-20 pt-16 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-primary/10 via-background to-background" />
        <div className="container md:px-4 mx-auto relative z-10">
          {/* Mobile Panda */}
          <div className="lg:hidden flex justify-center mb-5">

            <div className="animate-panda-sway">
              <div className="animate-panda-breathe">
                {/* Blush Hearts */}

                <div
                  className={`relative w-48 h-48 sm:w-64 sm:h-64 cursor-pointer transition-all duration-700 ease-out 
                      active:scale-95
                      ${isPopping ? 'animate-pop' : ''}`}
                  onClick={handlePandaClick}
                >
                  <Image
                    src="/mobile_hero.svg"
                    alt="Pixel Panda Mascot"
                    fill
                    priority
                    className="select-none object-contain drop-shadow-[0_20px_50px_rgba(var(--primary),0.2)]"
                  />
                  {/* Cheek Blush for Mobile */}
                  <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ${showBlush ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-[55%] left-[38%] w-6 h-3 sm:w-8 sm:h-4 bg-pink-400/30 rounded-full blur-lg animate-pulse" />
                    <div className="absolute top-[55%] right-[38%] w-6 h-3 sm:w-8 sm:h-4 bg-pink-400/30 rounded-full blur-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-12 gap-12 items-center justify-center">
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary tracking-wider">PREMIUM MARKETPLACE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Discover & Collect <br />
                <span className="text-primary italic">Exclusive</span> Digital Assets
              </h1>
              <p className="text-sm px-3 sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Pixel Panda is the premium marketplace for unique digital creations.
                Explore a world of limited edition assets from top creators.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                <Link href="/category/all">
                  <Button size="lg" className="h-11 sm:h-12 px-6 sm:px-8 rounded-full shadow-lg shadow-primary/20 text-sm sm:text-base">
                    Explore Market <ShoppingCart className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href={user ? "/products" : "/signup"}>
                  <Button variant="outline" size="lg" className="h-11 sm:h-12 px-6 sm:px-8 rounded-full text-sm sm:text-base">
                    {user ? 'Start Exploring' : 'Start Creating'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>



            {/* Desktop Panda */}
            <div
              className="hidden select-none lg:block lg:col-span-5 relative group"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              ref={imageRef}
            >
              {/* Premium Glow Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-glow-pulse -z-10" />

              {/* Drag Hint */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground/60 text-xs font-bold uppercase tracking-widest animate-pulse pointer-events-none">
                <Move className="h-3 w-3" />
                <span>Drag to Rotate</span>
              </div>

              {/* 2D Container */}
              <div
                className="relative w-full h-full flex items-center justify-center transition-transform duration-75 ease-linear"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseEnter={() => setShowBlush(true)}
                onMouseLeave={() => setShowBlush(false)}
              >




                {/* Triple Layered Animation: Sway -> Breathe -> Interaction */}
                <div className="animate-panda-sway pointer-events-none"> {/* Disable pointer events to let parent handle drag */}
                  <div className="animate-panda-breathe">
                    <div
                      className={`relative w-120 h-120 mx-auto transition-all duration-700 ease-out 
                        ${isPopping ? 'animate-pop' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent drag start on click if needed, or allow both
                        handlePandaClick();
                      }}
                    >
                      <Image
                        src="/hero.svg"
                        alt="Pixel Panda Mascot"
                        fill
                        priority
                        className="object-contain drop-shadow-[0_20px_50px_rgba(var(--primary),0.2)]"
                        style={{ pointerEvents: 'none' }} // Ensure click passes through to parent if desired, or remove to catch clicks
                        draggable={false}
                      />
                    </div>
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
            {user ? 'Welcome back! Explore the marketplace and find your next masterpiece.' : 'Join thousands of collectors on Pixel Panda. Sign up now and discover your next favorite asset.'}
          </p>
          <Link href={user ? "/products" : "/signup"}>
            <Button size="lg" className="h-12 px-10 rounded-full shadow-xl shadow-primary/20">
              {user ? 'Go to Marketplace' : 'Get Started'}
            </Button>
          </Link>
        </div>
      </section>
      <footer />
    </div>
  );
}
