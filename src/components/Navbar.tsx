'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, LogIn, UserPlus, Sparkles, LogOut, User, Loader2, LayoutDashboard, ShoppingBag, Settings, Package, ChevronDown, Monitor, FileCode, PenTool, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';
import CartSidebar from './cart-sidebar';

const categories = [
    {
        title: "All Assets",
        href: "/category/all",
        description: "Browse our entire library of premium digital assets.",
        icon: Sparkles
    },
    {
        title: "Mockups",
        href: "/category/mockups",
        description: "High-quality mockups for your designs.",
        icon: Monitor
    },
    {
        title: "Templates",
        href: "/category/templates",
        description: "Ready-to-use templates for various purposes.",
        icon: FileCode
    },
    {
        title: "Vectors",
        href: "/category/vectors",
        description: "Scalable vector graphics and icons.",
        icon: PenTool
    },
]

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout, loading } = useAuth();
    const { count } = useCart();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-4">
            <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 relative">
                        <Image
                            src="/Logo.svg"
                            alt="Pixel Panda Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-black tracking-tight hidden sm:block">
                        PIXEL PANDA
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex flex-1 items-center justify-center gap-8">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-6">
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent font-bold text-sm">Assets</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-card">
                                        {categories.map((category) => (
                                            <li key={category.title}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={category.href}
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted"
                                                    >
                                                        <div className="flex items-center gap-2 text-sm font-bold leading-none">
                                                            <category.icon className="h-4 w-4" />
                                                            {category.title}
                                                        </div>
                                                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                                            {category.description}
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={cn("text-sm font-bold hover:text-primary transition-colors cursor-pointer")}>
                                    <Link href="/about">
                                        About
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={cn("text-sm font-bold hover:text-primary transition-colors cursor-pointer")}>
                                    <Link href="/contact">
                                        Contact
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Desktop Search Bar & Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex w-64 mr-2">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/50 border-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium border border-transparent focus:border-primary/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ModeToggle />

                        <CartSidebar>
                            <Button variant="ghost" size="icon" className="relative group">
                                <ShoppingBag className="h-5 w-5 group-hover:text-primary transition-colors" />
                                {count > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                            </Button>
                        </CartSidebar>

                        {loading ? (
                            <Button variant="ghost" size="icon" disabled>
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </Button>
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 p-0 rounded-full hover:bg-primary/10">
                                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-black leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer font-bold">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {user.role === 'admin' && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin" className="cursor-pointer font-bold">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Admin Panel</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-destructive font-bold focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" className="font-bold">Log in</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="font-bold rounded-full px-6">Sign up</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col h-full py-6">
                                    <div className="space-y-6">
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Search assets..."
                                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">Navigation</h4>
                                            <Link href="/" className="block px-2 py-1 text-lg font-bold hover:text-primary transition-colors">Home</Link>
                                            <Link href="/category/all" className="block px-2 py-1 text-lg font-bold hover:text-primary transition-colors">Browse</Link>
                                            <Link href="/about" className="block px-2 py-1 text-lg font-bold hover:text-primary transition-colors">About</Link>
                                            <Link href="/contact" className="block px-2 py-1 text-lg font-bold hover:text-primary transition-colors">Contact</Link>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <p className="text-xs font-black uppercase text-muted-foreground">Assets</p>
                                            {categories.map((cat) => (
                                                <Link key={cat.title} href={cat.href} className="flex items-center gap-2">
                                                    <cat.icon className="h-4 w-4 text-primary" />
                                                    <span className="font-bold">{cat.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-border">
                                            {user ? (
                                                <Button onClick={logout} variant="destructive" className="w-full">Logout</Button>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Link href="/login"><Button variant="outline" className="w-full">Login</Button></Link>
                                                    <Link href="/signup"><Button className="w-full">Signup</Button></Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
