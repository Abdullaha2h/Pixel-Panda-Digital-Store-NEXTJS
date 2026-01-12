'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="flex-1 w-full flex flex-col pt-16 pb-24 md:pb-0">
                {children}
            </main>
            <Footer />
        </>
    );
}
