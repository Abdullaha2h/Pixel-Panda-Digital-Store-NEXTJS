import React from 'react';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, Mail, Code2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '@/components/contact-form';

export default function AboutPage() {
    return (
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-4 relative bg-background">
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full max-w-6xl bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="container max-w-6xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center space-y-12">
                    {/* About/Bio */}
                    <div className="space-y-8 flex flex-col items-center max-w-3xl">
                        <div className="relative h-40 w-40 rounded-[2.5rem] overflow-hidden border-4 border-primary/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Image
                                src="/hero.svg"
                                alt="Abdullah"
                                fill
                                className="object-contain p-2 bg-card"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <Code2 className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Full Stack Architect</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                                I'm <span className="text-primary">Abdullah.</span>
                            </h1>
                        </div>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
                            Crafting premium digital experiences at <span className="text-foreground font-black">Pixel Panda</span>.
                            Focused on bridging the gap between imagination and execution with high-quality assets.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 pt-4">
                            <Link href="/contact">
                                <Button size="lg" className="h-14 px-10 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                                    Get in Touch <MessageSquare className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>

                            <div className="flex gap-4">
                                <Link href="https://github.com/Abdullaha2h" target="_blank" className="h-14 w-14 rounded-2xl border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                                    <Github className="h-7 w-7" />
                                </Link>
                                <Link href="https://www.linkedin.com/in/muhammad-abdullah-08879822a/" target="_blank" className="h-14 w-14 rounded-2xl border border-border flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1">
                                    <Linkedin className="h-7 w-7" />
                                </Link>
                                <Link href="mailto:abdullaha2hh2a@gmail.com" className="h-14 w-14 rounded-2xl border border-border flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all hover:-translate-y-1">
                                    <Mail className="h-7 w-7" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
