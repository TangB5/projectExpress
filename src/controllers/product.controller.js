import Product from '../models/product.model.js';
import { uploadFileToSupabase } from '../services/fileUploader.js';

export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      description, 
      price, 
      stock, 
      image,
      status, 
      statusColor,
      isPromo, 
      is_new,
      oldPrice,
      likes
    } = req.body;

    // Validation des champs requis
    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Nom, catégorie et prix sont requis.' });
    }

    const newProduct = new Product({
      name,
      category,
      description,
      price: Number(price),
      stock: Number(stock) || 0,
      image,
      status,
      statusColor,
      isPromo: isPromo === 'true',
      is_new: is_new === 'true',
      likes: Number(likes) || 0,
      oldPrice: Number(oldPrice) || null,
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Produit créé avec succès !',
      product: newProduct,
    });

  } catch (error) {
    console.error('Erreur de création de produit :', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Données invalides', errors: error.errors });
    }
    
    res.status(500).json({ message: 'Erreur serveur lors de la création du produit.' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 50, category, sort = '-createdAt' } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    
    const products = await Product.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur getAllProducts:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Erreur getProductById:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      price,
      stock,
      isPromo,
      is_new,
      oldPrice,
      createdAt
    } = req.body;

    const updateData = {
      name,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      isPromo: isPromo === 'true' || isPromo === true,
      is_new: is_new === 'true' || is_new === true,
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      createdAt: createdAt || new Date().toISOString()
    };
    
    if (typeof stock !== 'undefined') {
      updateData.status = stock > 10 ? 'En stock' : 'Rupture';
      updateData.statusColor = stock > 10 ? 'green' : 'red';
    }
    
    if (req.file) {
      const publicUrl = await uploadFileToSupabase(req.file);
      updateData.image = publicUrl;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Erreur deleteProduct:', error);
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { like } = req.body; 

    const incrementValue = like ? 1 : -1;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $inc: { likes: incrementValue } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.status(200).json({
      message: like ? 'Like ajouté avec succès' : 'Like retiré avec succès',
      product: updatedProduct,
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du like :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getPopularProducts = async (req, res) => {
  try {
    const popularProducts = await Product.find({})
      .sort({ likes: -1 })
      .limit(5);          

    res.status(200).json(popularProducts);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits populaires :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};