import mongoose from 'mongoose';

// Schéma pour les articles individuels dans une commande
const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    // Fait référence au modèle Product
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1 // La quantité doit être d'au moins 1
  },
  price: {
    type: Number,
    required: true
  }
}, {
  _id: false
});
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: {
    type: [itemSchema],
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['En attente', 'En traitement', 'Expédiée', 'Annulée'],
    default: 'En attente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Order = mongoose.model('Order', orderSchema);
export default Order;