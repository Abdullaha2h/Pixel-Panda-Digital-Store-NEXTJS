'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Users, LayoutDashboard, Loader2, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="flex min-h-screen pt-16">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-background hidden md:block fixed h-[calc(100vh-4rem)] overflow-poster">
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

            {/* Mobile Sidebar (Optional/Simplified for now as not strictly requested but good to have, skipping for speed unless needed) */}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
