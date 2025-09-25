import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Informations de commande manquantes' });
    }

    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
      }

      // Ajout du prix du produit à l'article de la commande
      item.price = product.price;
      total += product.price * item.quantity;

      // Mise à jour du stock
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
};

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.productId', 'name price')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const totalOrders = await Order.countDocuments({});

    res.status(200).json({ orders, total: totalOrders });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price');
      
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};