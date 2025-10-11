import mongoose from 'mongoose';

// Schéma pour les articles individuels dans une commande
const itemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // référence au modèle Product
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: {
        type: [itemSchema],
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['En attente', 'En traitement', 'Expédiée', 'Annulée'],
        default: 'En attente',
    },
    paymentMethod: {
        type: String,
        default: 'non précisé', // ajouter si ton frontend l’attend
    },
    details: {
        address: String,
        trackingNumber: String,
        estimatedDelivery: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Virtual pour exposer totalAmount au frontend
orderSchema.virtual('totalAmount').get(function () {
    return this.total;
});

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
