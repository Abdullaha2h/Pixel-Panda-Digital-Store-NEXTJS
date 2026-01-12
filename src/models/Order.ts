import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            name: String,
            price: Number,
            image: String,
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed', // Assuming immediate payment for digital goods for now
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
