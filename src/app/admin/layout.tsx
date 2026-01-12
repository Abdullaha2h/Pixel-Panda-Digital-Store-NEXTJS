'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Users, LayoutDashboard, Loader2, ArrowLeft, Package, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex min-h-screen pt-16 relative">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r bg-background hidden md:block fixed h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="flex flex-col h-full py-6 px-3">
                    <div className="mb-6 px-4">
                        <h2 className="text-lg font-semibold tracking-tight">Admin Console</h2>
                        <p className="text-sm text-muted-foreground">Manage your application</p>
                    </div>
                    <div className="space-y-1">
                        <Link href="/admin">
                            <Button variant="ghost" className="w-full justify-start">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button variant="ghost" className="w-full justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                Users
                            </Button>
                        </Link>
                        <Link href="/admin/products">
                            <Button variant="ghost" className="w-full justify-start">
                                <Package className="mr-2 h-4 w-4" />
                                Products
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-auto px-4">
                        <Link href="/">
                            <Button variant="outline" size="sm" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to App
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Admin Nav - Floating Trigger */}
            <div className="md:hidden fixed top-20 left-4 z-40">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="default" size="icon" className="rounded-full shadow-lg">
                            <LayoutDashboard className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <SheetTitle className="px-4 pt-4">Admin Menu</SheetTitle>
                        <div className="flex flex-col h-full py-6 px-3">
                            <div className="space-y-1">
                                <SheetClose asChild>
                                    <Link href="/admin">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="/admin/users">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Users className="mr-2 h-4 w-4" />
                                            Users
                                        </Button>
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="/admin/products">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Package className="mr-2 h-4 w-4" />
                                            Products
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </div>
                            <div className="mt-auto">
                                <SheetClose asChild>
                                    <Link href="/">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to App
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
