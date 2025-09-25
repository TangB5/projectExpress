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

    const newProduct = new Product({
      name,
      category,
      description,
      price: Number(price),
      stock: Number(stock),
      image,
      status,
      statusColor,
      isPromo: isPromo === 'true',
      is_new: is_new === 'true',
      likes: Number(likes),
      oldPrice: Number(oldPrice) || null,
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Produit créé avec succès !',
      product: newProduct,
    });

  } catch (error) {
    console.error('Erreur de création de produit :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du produit.' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
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
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
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