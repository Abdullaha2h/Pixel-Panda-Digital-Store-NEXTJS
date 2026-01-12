import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        await dbConnect();

        // Check if requester is admin
        const currentUser = await User.findById(decoded.userId);
        if (!currentUser || currentUser.role !== 'admin') {
            return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
        }

        const [totalUsers, totalOrders, activeProducts, revenueData] = await Promise.all([
            User.countDocuments({}),
            Order.countDocuments({}),
            Product.countDocuments({}),
            Order.aggregate([
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ])
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        return NextResponse.json({
            totalUsers,
            totalOrders,
            totalRevenue,
            activeProducts
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
