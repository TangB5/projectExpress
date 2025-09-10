import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import bcrypt from "bcryptjs";
import fs from 'fs';
import dotenv from 'dotenv';
import Product from './models/product.model.js';
import User from './models/user.model.js';
import jwt from "jsonwebtoken";
import Order from './models/commande.model.js';
import { createClient } from '@supabase/supabase-js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();


const allowedOrigins = [
  'http://localhost:3001',
  'https://projectnext-eight.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const BUCKET_NAME = 'meublemoderne';

app.post('/api/auth/createProduct', async (req, res) => {
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
      // Conversion des types
      price: Number(price),
      stock: Number(stock),
      image,
      status,
      statusColor,
      isPromo: isPromo === 'true', // Convertit 'true' en true, sinon false
      is_new: is_new === 'true',     // Convertit 'true' en true, sinon false
      likes: Number(likes ),   // Convertit 'true' en true, sinon false
      oldPrice: Number(oldPrice) || null,
      createdAt: new Date(),
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
});
// Read product
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
});

// Read product by id
app.get('/api/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({message: 'Product not found'});
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
});



//update product
app.put('/api/product/:id', (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  } else {
    next();
  }
}, async (req, res) => {
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

    // Gestion du status selon le stock
    if (typeof stock !== 'undefined') {
      updateData.status = stock > 10 ? 'En stock' : 'Rupture';
      updateData.statusColor = stock > 10 ? 'green' : 'red';
    }

    // Upload image sur Supabase si fournie
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, req.file.buffer, { cacheControl: '3600', upsert: true });

      if (error) {
        return res.status(500).json({ message: 'Erreur lors de l’upload de l’image', details: error.message });
      }

      const { publicUrl } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
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
});

//delete product
app.delete('/api/product/:id', async (req, res) => {
  try {
    const { id } = req.params;  
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({message: 'Product not found'});
    }
    res.status(200).json({message: 'Product deleted successfully'});
  } catch (error) {
    res.status(500).send({message: error.message});
  }
});


// Remplacez vos deux routes existantes par celle-ci
app.post('/api/products/:id/toggle-like', async (req, res) => {
  try {
    const { id } = req.params;
    const { like } = req.body; // Récupère le champ 'like' du corps de la requête

    // Détermine le montant de l'incrémentation (-1 ou +1)
    const incrementValue = like ? 1 : -1;

    // Met à jour le compteur de likes dans la base de données
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
});

 // read all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
});

//read user by id
app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({message: 'User not found'});
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({message: error.message});
  }
});


// creat new user

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password,role } = req.body;

    // Validation des champs requis
    const errors = {};
    if (!name) errors.name = "Le nom est requis";
    if (!email) errors.email = "L'email est requis";
    if (!password) errors.password = "Le mot de passe est requis";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Champs manquants", errors });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé",
        errors: { email: "Cet email est déjà utilisé" }
      });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Réponse réussie
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Erreur lors de la création d'utilisateur :", error);
    res.status(500).json({
      message: "Erreur serveur",
      errors: { general: "Une erreur est survenue, réessayez plus tard." }
    });
  }
});

//update user
app.put('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).send({message: 'User not found'});
    }

    const updatedUser = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({message: error.message});
  } 
});



mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });



app.get("/", (req, res) => {
  res.send("Backend is running on Vercel!");
});



app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // 2️⃣ Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // 3️⃣ Créer un JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("authToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
});


    // 5️⃣ Retourner une réponse
    res.status(200).json({
      message: "Connexion réussie",
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.json({ success: true });
});


app.get("/api/session", async (req, res) => {
  const token = req.cookies.authToken; 

  if (!token) {
    return res.status(200).json(null); 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérification du JWT
    const user = await User.findById(decoded._id).select('-password'); // Trouver l'utilisateur, sans le mot de passe

    if (!user) {
      return res.status(200).json(null); // Utilisateur non trouvé, session expirée ou invalide
    }

    // Si tout va bien, renvoie les informations utilisateur
    res.json({ userId: user._id, role: user.role , email: user.email });
  } catch (error) {
    console.error("Erreur de vérification de session :", error);
    return res.status(200).json(null); // Si erreur de vérification
  }
});


app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Informations de commande manquantes' });
    }

    // Calculer le total et vérifier le stock
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
      }

     
      item.price = product.price;
      total += product.price * item.quantity;

      // Décrémenter le stock
      product.stock -= item.quantity;
      if (product.stock <= 0) {
        product.status = 'Rupture';
        product.statusColor = 'red';
      }
      await product.save();
    }

    
    const newOrder = await Order.create({ userId, items, total });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Votre fichier de routes Express.js

app.get('/api/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page ) || 1;
    const limit = parseInt(req.query.limit ) || 10;
    const skip = (page - 1) * limit;

    // Récupérer les commandes paginées
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.productId', 'name price')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Trie par date de création décroissante

    // Récupérer le nombre total de commandes pour la pagination
    const totalOrders = await Order.countDocuments({});

    // Renvoyer les données et le total
    res.status(200).json({ orders, total: totalOrders });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Votre fichier de routes Express.js (par exemple, index.js)

app.get('/api/products/popular', async (req, res) => {
  try {
    const popularProducts = await Product.find({})
      .sort({ likes: -1 }) // Trie par nombre de likes décroissant
      .limit(5);          // Limite à 5 résultats

    res.status(200).json(popularProducts);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits populaires :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Lire commande par ID
app.get('/api/order/:id', async (req, res) => {
  try {
    const order = await order.findById(req.params.id).populate('userId', 'name email').populate('items.productId', 'name price');
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour le statut d'une commande
app.put('/api/order/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default app;