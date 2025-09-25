import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Assure que le prix est toujours positif
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  statusColor: {
    type: String,
    required: true,
  },
  isPromo: {
    type: Boolean,
    default: false,
  },
  is_new: {
    type: Boolean,
    default: false,
  },
  oldPrice: {
    type: Number,
    min: 0,
    default: null, // Initialise l'ancien prix à null
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;