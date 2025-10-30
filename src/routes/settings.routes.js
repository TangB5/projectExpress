import express from 'express';
import {
    getSettings,
    updateGeneralSettings,
    updatePaymentSettings,
    updateShippingSettings,
    updateNotificationSettings,
} from '../controllers/settings.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: Gestion des paramètres de la boutique (Dev mode, sans auth)
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Récupère TOUS les paramètres de la boutique (dev mode).
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Succès. Retourne l'objet complet des paramètres.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/', getSettings);

/**
 * @swagger
 * /settings/general:
 *   put:
 *     summary: Met à jour les paramètres généraux (nom, devise, maintenance).
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeName:
 *                 type: string
 *                 example: ModerneMeuble Cameroun
 *               currency:
 *                 type: string
 *                 enum: [XAF, EUR, USD]
 *                 example: XAF
 *               maintenance:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Mise à jour réussie.
 */
router.put('/general', updateGeneralSettings);

/**
 * @swagger
 * /settings/payments:
 *   put:
 *     summary: Met à jour les méthodes de paiement.
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: mtn_momo
 *                 enabled:
 *                   type: boolean
 *                   example: true
 *     responses:
 *       200:
 *         description: Mise à jour réussie.
 */
router.put('/payments', updatePaymentSettings);

/**
 * @swagger
 * /settings/shipping:
 *   put:
 *     summary: Met à jour les zones et les coûts de livraison.
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: douala
 *                 cost:
 *                   type: number
 *                   example: 2500
 *                 enabled:
 *                   type: boolean
 *                   example: true
 *     responses:
 *       200:
 *         description: Mise à jour réussie.
 */
router.put('/shipping', updateShippingSettings);

/**
 * @swagger
 * /settings/notifications:
 *   put:
 *     summary: Met à jour les paramètres de notifications.
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newOrderEmail:
 *                 type: boolean
 *                 example: true
 *               lowStockAlert:
 *                 type: boolean
 *                 example: true
 *               paymentFailureSMS:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Mise à jour réussie.
 */
router.put('/notifications', updateNotificationSettings);


export default router;
