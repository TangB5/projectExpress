import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from '../controllers/order.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestion des commandes
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crée une nouvelle commande.
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *     responses:
 *       201:
 *         description: Commande créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Informations manquantes ou stock insuffisant.
 *       401:
 *         description: Non autorisé.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/', requireAuth, createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupère toutes les commandes (avec pagination).
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Le numéro de la page.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Le nombre d'éléments par page.
 *     responses:
 *       200:
 *         description: Liste des commandes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 total:
 *                   type: integer
 *                   description: Le nombre total de commandes.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/', getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Récupère une commande par son ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la commande.
 *     responses:
 *       200:
 *         description: Commande trouvée.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Met à jour le statut d'une commande.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la commande.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: 'En cours de traitement'
 *     responses:
 *       200:
 *         description: Statut de la commande mis à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/:id', updateOrderStatus);
export default router;