import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Helper to check authentication and admin role
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

export async function GET(req: Request) {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // Filtering
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const query: any = { isActive: true };

    if (featured === 'true') {
        query.isFeatured = true;
    }

    if (category && category !== 'all') {
        const categories = category.split(',');
        if (categories.length > 1) {
            query.category = { $in: categories.map(c => new RegExp(`^${c}$`, 'i')) };
        } else {
            query.category = { $regex: category, $options: 'i' };
        }
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
        ];
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    try {
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name email');

        const total = await Product.countDocuments(query);

        return NextResponse.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching products', error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const adminUser = await checkAdmin();

    if (!adminUser) {
        return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const product = await Product.create({
            ...body,
            createdBy: adminUser._id,
        });

        return NextResponse.json({ product, message: 'Product created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating product', error: (error as Error).message }, { status: 500 });
    }
}
