import express from 'express';
import {
  loginUser,
  logoutUser,
  getSession,
} from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Gestion de l'authentification et des sessions
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecte un utilisateur.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: authToken=ey...; Path=/; HttpOnly
 *       401:
 *         description: Email ou mot de passe incorrect.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnecte un utilisateur.
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie.
 *       401:
 *         description: Non autorisé - L'utilisateur n'est pas connecté.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/logout', logoutUser);

/**
 * @swagger
 * /auth/session:
 *   get:
 *     summary: Vérifie la session de l'utilisateur.
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Session valide, informations utilisateur retournées.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Token invalide ou expiré.
 */
router.get('/session', getSession);

export default router;
