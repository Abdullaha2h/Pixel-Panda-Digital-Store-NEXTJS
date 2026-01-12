import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a product description'],
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a product price'],
            default: 0,
        },
        category: {
            type: String,
            required: [true, 'Please provide a product category'],
            // enum: ['templates', 'icons', 'ui-kits', 'fonts', 'themes', 'other'], // Removed strict enum to allow custom categories
        },
        brand: {
            type: String,
            default: 'PixelPanda',
        },
        stock: {
            type: Number,
            required: [true, 'Please provide stock number'],
            default: 0,
        },
        images: {
            type: [String],
            default: ['https://ulbcqotmtnzedaimvqvj.storage.supabase.co/storage/v1/s3'], // Default fallback image
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
