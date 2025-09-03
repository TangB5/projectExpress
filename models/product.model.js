import mongoose from "mongoose";

// Définition du schéma produit
const ProductSchema = new mongoose.Schema({
  name: {
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
  },
  image: {
    type: String, // Cela peut être soit une URL de l'image, soit une chaîne de type base64
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  isPromo: {
    type: Boolean,
    default: false,
  },
  is_new: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    required: true,
    default: 0 
  },
  oldPrice: {
    type: Number,
    require:false,
  },
});

// Création du modèle produit
const Product = mongoose.model("Product", ProductSchema);

export default Product;
