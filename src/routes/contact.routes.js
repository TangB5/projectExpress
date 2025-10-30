import express from 'express';
import { getContactInfo, sendContactEmail } from '../controllers/contact.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Gestion du formulaire de contact et infos de contact
 */

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Récupère les informations de contact de la boutique
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Succès
 *       404:
 *         description: Paramètres non trouvés
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getContactInfo);

/**
 * @swagger
 * /contact/send:
 *   post:
 *     summary: Envoie un message depuis le formulaire de contact
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 example: jean@example.com
 *               subject:
 *                 type: string
 *                 example: Question générale
 *               message:
 *                 type: string
 *                 example: Bonjour, j’ai une question concernant...
 *     responses:
 *       200:
 *         description: Email envoyé avec succès
 *       400:
 *         description: Champs invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/send", sendContactEmail);

export default router;
