import { Mail, MessageSquare, Phone, MapPin, Linkedin, Github, CheckCircle2, Globe, Clock } from 'lucide-react';
import ContactForm from '@/components/contact-form';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
    return (
        <div className="h-[calc(100vh-73px)] flex items-center px-4 relative overflow-hidden bg-background">
            {/* Professional Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -z-10" />

            <div className="container max-w-6xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left Column: Context & Socials */}
                    <div className="space-y-10">
                        <div className="space-y-0">
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                                Let's Build <br />
                                <span className="text-primary italic relative">Something</span> Iconic.
                            </h1>
                        </div>


                        {/* Social Icons */}
                        <div className="space-y-3">
                            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-muted-foreground">Professional Profiles</h3>
                            <div className="flex gap-3 sm:gap-4">
                                <Link
                                    href="https://github.com/Abdullaha2h"
                                    target="_blank"
                                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1 animate-cute-bounce group"
                                >
                                    <Github className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/in/muhammad-abdullah-08879822a/"
                                    target="_blank"
                                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1 animate-cute-bounce group"
                                >
                                    <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-[#0077b5] transition-colors" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-linear-to-tr from-primary/10 via-purple-500/10 to-transparent rounded-[3rem] blur-2xl -z-10" />
                        <div className="bg-card/50 backdrop-blur-xl border border-border p-4 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative">
                            <div className="mb-3 sm:mb-4">
                                <h2 className="text-xl sm:text-2xl font-black mb-1 tracking-tight text-foreground">Message Us</h2>
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Fill in the details below and we'll be in touch.</p>
                            </div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
