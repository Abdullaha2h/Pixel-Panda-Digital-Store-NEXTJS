import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role Key for deletions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Helper to check authentication and admin role (duplicated for now, could move to lib/auth)
async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        await dbConnect();
        const user = await User.findById(decoded.userId);

        if (user && user.role === 'admin') {
            return user;
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Helper: Extract file path from Supabase Public URL
// URL: https://xyz.supabase.co/storage/v1/object/public/products/filename.jpg
// Path: filename.jpg (or folder/filename.jpg)
function getFilePathFromUrl(url: string) {
    if (!url.includes('/storage/v1/object/public/products/')) return null;
    const parts = url.split('/products/');
    return parts.length > 1 ? parts[1] : null;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;

    try {
        const product = await Product.findById(id).populate('createdBy', 'name email');

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching product', error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const adminUser = await checkAdmin();
    if (!adminUser) {
        return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    if (!supabaseServiceKey) {
        console.error('SERVER ERROR: Missing SUPABASE_SERVICE_ROLE_KEY');
        // Proceed with DB update but warn? Or fail? Let's proceed but log error.
    }

    const { id } = await params;

    try {
        const body = await req.json();

        // 1. Fetch existing product to compare images
        const oldProduct = await Product.findById(id);
        if (!oldProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // 2. Identify removed images
        const oldImages: string[] = oldProduct.images || [];
        const newImages: string[] = body.images || [];

        // Find images present in old but NOT in new
        const imagesToDelete = oldImages.filter(img => !newImages.includes(img) && img.includes('supabase.co'));

        if (imagesToDelete.length > 0 && supabaseServiceKey) {
            const supabase = createClient(supabaseUrl, supabaseServiceKey);
            const pathsToDelete = imagesToDelete.map(getFilePathFromUrl).filter(p => p !== null) as string[];

            if (pathsToDelete.length > 0) {
                console.log('Cleanup: Deleting removed images from Supabase:', pathsToDelete);
                const { error } = await supabase.storage
                    .from('products')
                    .remove(pathsToDelete);

                if (error) console.error('Supabase Delete Error:', error);
            }
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ product, message: 'Product updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating product', error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const adminUser = await checkAdmin();
    if (!adminUser) {
        return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = await params;

    try {
        // 1. Fetch product to get images
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // 2. Delete images from Supabase
        const images: string[] = product.images || [];
        const validSupabaseImages = images.filter(img => img.includes('supabase.co'));

        if (validSupabaseImages.length > 0 && supabaseServiceKey) {
            const supabase = createClient(supabaseUrl, supabaseServiceKey);
            const pathsToDelete = validSupabaseImages.map(getFilePathFromUrl).filter(p => p !== null) as string[];

            if (pathsToDelete.length > 0) {
                console.log('Cleanup: Deleting product images from Supabase:', pathsToDelete);
                const { error } = await supabase.storage
                    .from('products')
                    .remove(pathsToDelete);

                if (error) console.error('Supabase Delete Error:', error);
            }
        }

        // 3. Delete from DB
        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting product', error: (error as Error).message }, { status: 500 });
    }
}
