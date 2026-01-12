'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    return (
        <>
            {!isAuthPage && <Navbar />}
            <main className={`flex-1 w-full flex flex-col ${isAuthPage ? '' : 'pt-16'}`}>
                {children}
            </main>
        </>
    );
}
