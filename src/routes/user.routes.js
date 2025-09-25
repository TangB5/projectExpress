import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
} from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère tous les utilisateurs.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur.
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur.
 *     responses:
 *       200:
 *         description: L'utilisateur a été trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Champs manquants ou email déjà utilisé.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/', createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à mettre à jour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/:id', updateUser);

export default router;
