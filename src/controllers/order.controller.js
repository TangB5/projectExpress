import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

// Fonction utilitaire pour vérifier stock et calculer total
const calculateOrderTotal = async (items) => {
    let total = 0;

    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Produit non trouvé: ${item.productId}`);

        if (product.stock < item.quantity) {
            throw new Error(`Stock insuffisant pour ${product.name}`);
        }

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

    return total;
};

// Crée une nouvelle commande
export const createOrder = async (req, res) => {
    try {
        const { userId, items, paymentMethod, details } = req.body;

        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ message: 'Informations de commande manquantes' });
        }

        const total = await calculateOrderTotal(items);

        const newOrder = await Order.create({
            userId,
            items,
            total,
            paymentMethod: paymentMethod || 'non précisé',
            details: details || {},
        });

        // Populer userId et items.productId
        await newOrder.populate([
            { path: 'userId', select: 'name email' },
            { path: 'items.productId', select: 'name price' }
        ]);

        res.status(201).json(newOrder.toJSON());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

// Récupère toutes les commandes avec pagination
// Récupère toutes les commandes avec pagination + filtrage par utilisateur et statut
export const getAllOrders = async (req, res) => {
    try {
        const {
            userId,
            status,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        const skip = (page - 1) * limit;
        const query = {};


        if (userId) query.userId = userId;

        // Filtre par statut si défini
        if (status && status !== "all") {
            query.status = status;
        }


        if (search) {
            query.$or = [
                { "items.productId.name": { $regex: search, $options: "i" } },
                { "details.trackingNumber": { $regex: search, $options: "i" } },
            ];
        }


        const orders = await Order.find(query)
            .populate("userId", "name email phone avatar")
            .populate("items.productId", "name price images category")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));


        const totalOrders = await Order.countDocuments(query);


        const statusAggregation = await Order.aggregate([
            { $match: query },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const statusCounts = statusAggregation.reduce(
            (acc, s) => ({ ...acc, [s._id]: s.count }),
            { all: totalOrders }
        );

        res.status(200).json({
            orders: orders.map((o) => o.toJSON()),
            total: totalOrders,
            statusCounts,
        });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des commandes :", error);
        res.status(500).json({ message: error.message || "Erreur serveur" });
    }
};


// Récupère une commande par son ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('items.productId', 'name price');

        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

        res.status(200).json(order.toJSON());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

// Met à jour le statut d’une commande
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
            .populate('userId', 'name email')
            .populate('items.productId', 'name price');

        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

        res.status(200).json(order.toJSON());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};
// Récupère le nombre total d'articles dans le panier pour un utilisateur
export const getCartCount = async (req, res) => {
    try {
        const userId = req.user?._id; // Assure-toi que le middleware auth ajoute req.user
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        // On récupère toutes les commandes de l'utilisateur avec status "panier" (ou équivalent)
        const orders = await Order.find({ userId, status: "panier" });

        // Total des articles
        const count = orders.reduce((total, order) => {
            const orderCount = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0);
            return total + (orderCount || 0);
        }, 0);

        res.status(200).json({ count });
    } catch (error) {
        console.error("Erreur récupération count panier :", error);
        res.status(500).json({ message: error.message || "Erreur serveur" });
    }
};
