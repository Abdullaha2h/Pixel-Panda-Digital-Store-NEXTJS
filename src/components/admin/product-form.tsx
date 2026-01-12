'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Loader2,
    Upload,
    X,
    Image as ImageIcon,
    Save,
    ArrowLeft,
    Eye,
    Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/product-card';

interface ProductData {
    name: string;
    description: string;
    price: string;
    category: string;
    brand: string;
    stock: string;
    images: string[];
    isActive: boolean;
    isFeatured: boolean;
}

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
    productId?: string;
}

const CATEGORY_SUGGESTIONS = ['Templates', 'Icons', 'UI Kits', 'Fonts', 'Themes', 'Other'];

export default function ProductForm({ initialData, isEdit = false, productId }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<ProductData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '',
        category: initialData?.category || 'Templates',
        brand: initialData?.brand || 'PixelPanda',
        stock: initialData?.stock?.toString() || '0',
        images: initialData?.images || [],
        isActive: initialData?.isActive ?? true,
        isFeatured: initialData?.isFeatured ?? false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new window.Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                resolve(file);
                            }
                        },
                        'image/jpeg',
                        0.7 // quality
                    );
                };
            };
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const uploadedUrls: string[] = [];

        try {
            for (const file of files) {
                // Compress image before upload
                const compressedFile = file.type.startsWith('image/')
                    ? await compressImage(file)
                    : file;

                const uploadData = new FormData();
                uploadData.append('file', compressedFile);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData,
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Upload failed');
                }

                uploadedUrls.push(data.url);
            }

            const currentImages = formData.images.filter(img => !img.includes('default-fallback-placeholder') && !img.includes('supabase.co/storage/v1/s3'));

            setFormData(prev => ({
                ...prev,
                images: [...currentImages, ...uploadedUrls]
            }));
            toast.success('Images optimized and uploaded successfully');

        } catch (error) {
            console.error('Upload Error:', error);
            toast.error('Failed to upload image. Please check server configuration.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/products/${productId}` : '/api/products';
            const method = isEdit ? 'PUT' : 'POST';

            let finalImages = formData.images;
            if (finalImages.length === 0) {
                finalImages = ['https://ulbcqotmtnzedaimvqvj.storage.supabase.co/storage/v1/s3'];
            }

            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: finalImages,
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
                router.push('/admin/products');
                router.refresh();
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Construct preview object
    const previewProduct = {
        _id: 'preview',
        name: formData.name || 'Product Name',
        description: formData.description || 'Product description will appear here...',
        price: parseFloat(formData.price) || 0,
        category: formData.category || 'Category',
        images: formData.images.length > 0 ? formData.images : ['https://ulbcqotmtnzedaimvqvj.storage.supabase.co/storage/v1/s3'],
        rating: 5,
        totalReviews: 0,
        stock: parseInt(formData.stock) || 0,
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header - Fixed offset for Navbar */}
            <div className="flex items-center justify-between sticky top-16 bg-background/95 backdrop-blur z-40 py-4 border-b">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {isEdit ? 'Edit Product' : 'Create New Product'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Fill in the details below. Live preview is on the right.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="gap-2 rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || uploading}
                        className="gap-2 min-w-[160px] rounded-full shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isEdit ? 'Save Changes' : 'Publish Product'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-12">
                {/* Left Column: Form (7 cols) */}
                <div className="xl:col-span-7 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Visibility & Status - MOVED TO TOP FOR PROMINENCE */}
                        <Card className="border-primary/20 bg-primary/5 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-purple-500" />
                                    Visibility & Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 bg-background p-4 rounded-xl border border-border/50 transition-colors hover:border-primary/50">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                        className="h-5 w-5 rounded-md border-primary text-primary focus:ring-primary"
                                    />
                                    <div className="grid gap-0.5 leading-none">
                                        <Label htmlFor="isActive" className="cursor-pointer font-semibold text-sm">Active & Visible</Label>
                                        <p className="text-[10px] text-muted-foreground">Searchable in marketplace.</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 transition-colors hover:border-purple-500/50">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                        className="h-5 w-5 rounded-md border-purple-500 text-purple-600 focus:ring-purple-500"
                                    />
                                    <div className="grid gap-0.5 leading-none">
                                        <Label htmlFor="isFeatured" className="cursor-pointer font-semibold text-sm text-purple-700 dark:text-purple-400">Featured Asset</Label>
                                        <p className="text-[10px] text-muted-foreground text-purple-600/70">Show on main masterpieces.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media Section */}
                        <Card className="border-muted/60 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                    Media Gallery
                                </CardTitle>
                                <CardDescription>
                                    Add high-quality images to showcase your product.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {formData.images.map((url, index) => (
                                            <div key={index} className="relative aspect-square border rounded-xl overflow-hidden group bg-muted/20 shadow-sm">
                                                <Image
                                                    src={url}
                                                    alt={`Product ${index}`}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <Label htmlFor="image-upload" className="cursor-pointer">
                                            <div className={`
                                                relative aspect-square border-2 border-dashed rounded-xl
                                                flex flex-col items-center justify-center gap-2
                                                hover:bg-primary/5 hover:border-primary/50 transition-all
                                                ${uploading ? 'opacity-50 pointer-events-none' : ''}
                                            `}>
                                                {uploading ? (
                                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                ) : (
                                                    <>
                                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                                        <span className="text-xs font-medium text-muted-foreground">Add Image</span>
                                                    </>
                                                )}
                                                <Input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                />
                                            </div>
                                        </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Details Section */}
                        <Card className="border-muted/60 shadow-sm">
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Neo-Brutalism UI Kit"
                                        className="h-11 text-lg"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe the features and benefits..."
                                        rows={8}
                                        className="resize-none leading-relaxed"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing & Category */}
                        <Card className="border-muted/60 shadow-sm">
                            <CardHeader>
                                <CardTitle>Marketplace Data</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Price ($)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                                className="pl-7 h-11 text-lg font-mono"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="stock">Inventory Stock</Label>
                                        <Input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            min="0"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            required
                                            className="h-11"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Input
                                            list="categories"
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            placeholder="Select or type..."
                                            className="h-11"
                                        />
                                        <datalist id="categories">
                                            {CATEGORY_SUGGESTIONS.map((cat) => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="brand">Brand / Creator</Label>
                                        <Input
                                            id="brand"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            placeholder="PixelPanda"
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                {/* Moved to top */}

                            </CardContent>
                        </Card>
                    </form>
                </div>

                {/* Right Column: Live Preview (Sticky) (5 cols) */}
                <div className="xl:col-span-5">
                    <div className="sticky top-28 space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium tracking-wide uppercase">Live Preview</span>
                        </div>

                        {/* Wrapper to simulate card max-width if needed */}
                        <div className="max-w-sm mx-auto xl:max-w-none">
                            <ProductCard product={previewProduct} />
                        </div>

                        <div className="bg-muted/30 rounded-xl p-4 text-xs text-muted-foreground border border-dashed">
                            <p>This is how your product card will appear in the marketplace grid. Ensure images are high quality and text is concise.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
