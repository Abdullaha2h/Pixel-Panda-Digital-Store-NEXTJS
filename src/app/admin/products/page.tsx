'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Search, Pencil, Trash2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    isActive: boolean;
    createdAt: string;
}

export default function AdminProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // Get page from URL or default to 1
    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        fetchProducts();
    }, [page, searchParams]); // Refetch when URL params change

    async function fetchProducts() {
        setLoading(true);
        try {
            // Build query string
            const params = new URLSearchParams(searchParams.toString());
            if (!params.has('page')) params.set('page', '1');

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();

            if (res.ok) {
                setProducts(data.products);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            } else {
                toast.error(data.message || 'Failed to fetch products');
            }
        } catch (error) {
            toast.error('An error occurred while fetching products');
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); // Reset to page 1
        router.push(`/admin/products?${params.toString()}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Product deleted successfully');
                fetchProducts();
            } else {
                toast.error(data.message || 'Failed to delete product');
            }
        } catch (error) {
            toast.error('An error occurred while deleting product');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your marketplace products</p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex-1 max-w-sm flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="secondary">Search</Button>
                </form>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="capitalize">{product.category}</TableCell>
                                    <TableCell>${product.price.toFixed(2)}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                            {product.isActive ? 'Active' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/products/${product._id}/edit`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Simple Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/products?page=${currentPage - 1}`)}
                        disabled={currentPage <= 1}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <div className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/products?page=${currentPage + 1}`)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );
}
