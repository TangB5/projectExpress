import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleLike,
  getPopularProducts,
} from '../controllers/product.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupère tous les produits.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste de tous les produits.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erreur serveur.
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /products/popular:
 *   get:
 *     summary: Récupère les produits les plus populaires (5 par défaut).
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste des produits populaires.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erreur serveur.
 */
router.get('/popular', getPopularProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupère un produit par son ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du produit.
 *     responses:
 *       200:
 *         description: Le produit a été trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crée un nouveau produit.
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       201:
 *         description: Produit créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Non autorisé - L'utilisateur n'est pas connecté ou n'est pas un administrateur.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/', requireAuth, requireRole('admin'), createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Met à jour un produit.
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du produit à mettre à jour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Non autorisé.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/:id', requireAuth, requireRole('admin'), updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprime un produit.
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du produit à supprimer.
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès.
 *       401:
 *         description: Non autorisé.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.delete('/:id', requireAuth, requireRole('admin'), deleteProduct);

/**
 * @swagger
 * /products/{id}/toggle-like:
 *   post:
 *     summary: Ajoute ou retire un like à un produit.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du produit.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               like:
 *                 type: boolean
 *                 description: "true pour ajouter un like, 'false' pour le retirer."
 *                 example: true
 *     responses:
 *       200:
 *         description: Like mis à jour avec succès.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/:id/toggle-like', toggleLike);

export default router;
