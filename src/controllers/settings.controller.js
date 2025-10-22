import Settings from '../models/settings.model.js';


/**
 * Récupère le document singleton des paramètres.
 * Gère la création du document s'il n'existe pas.
 */
const getStoreSettings = async () => {
    try {
        return await Settings.getSettings();
    } catch (error) {
        console.error("Erreur lors de la récupération/création des paramètres:", error);
        throw new Error("Erreur de base de données lors de l'accès aux paramètres.");
    }
};

// --- Contrôleurs des opérations CRUD ---

/**
 * @route GET /api/settings
 * Récupère tous les paramètres de la boutique.
 */
export const getSettings = async (req, res) => {
    try {
        const settings = await getStoreSettings();
        return res.status(200).json(settings);
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
};


/**
 * @route PUT /api/settings/general
 * Met à jour les paramètres généraux de la boutique.
 */
export const updateGeneralSettings = async (req, res) => {
    const { storeName, email, phone, address, currency, maintenance } = req.body;

    try {
        const settings = await getStoreSettings();

        if (currency && !['XAF', 'EUR', 'USD'].includes(currency)) {
            return res.status(400).json({ message: 'Devise non valide.' });
        }

        settings.general = {
            ...settings.general,
            storeName: storeName ?? settings.general.storeName,
            email: email ?? settings.general.email,
            phone: phone ?? settings.general.phone,
            address: address ?? settings.general.address,
            currency: currency ?? settings.general.currency,
            maintenance: maintenance ?? settings.general.maintenance,
        };

        await settings.save();
        return res.status(200).json({ message: 'Paramètres généraux mis à jour.', general: settings.general });

    } catch (error) {
        console.error("Erreur lors de la mise à jour des paramètres généraux:", error);
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
    }
};


/**
 * @route PUT /api/settings/payments
 * Met à jour l'état (enabled/disabled) des méthodes de paiement.
 * Utilise la liste complète fournie par le frontend.
 */
export const updatePaymentSettings = async (req, res) => {
    const newPaymentMethods = req.body;

    if (!Array.isArray(newPaymentMethods)) {
        return res.status(400).json({ message: 'Le corps de la requête doit être un tableau de méthodes de paiement.' });
    }

    try {
        const settings = await getStoreSettings();

        // Mettre à jour les méthodes existantes et conserver la structure
        const updatedMethods = settings.payments.map(existingMethod => {
            const update = newPaymentMethods.find(m => m.id === existingMethod.id);
            if (update) {
                // Met à jour seulement 'enabled' pour garantir l'intégrité des autres champs
                return { ...existingMethod.toObject(), enabled: update.enabled };
            }
            return existingMethod.toObject();
        });

        settings.payments = updatedMethods;

        await settings.save();
        return res.status(200).json({ message: 'Méthodes de paiement mises à jour.', payments: settings.payments });

    } catch (error) {
        console.error("Erreur lors de la mise à jour des paiements:", error);
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour des paiements.' });
    }
};


/**
 * @route PUT /api/settings/shipping
 * Met à jour les zones de livraison et leurs coûts/états.
 */
export const updateShippingSettings = async (req, res) => {
    const newShippingZones = req.body;

    if (!Array.isArray(newShippingZones)) {
        return res.status(400).json({ message: 'Le corps de la requête doit être un tableau de zones de livraison.' });
    }

    try {
        const settings = await getStoreSettings();

        const updatedZones = settings.shipping.map(existingZone => {
            const update = newShippingZones.find(z => z.id === existingZone.id);
            if (update) {
                return {
                    ...existingZone.toObject(),
                    cost: update.cost ?? existingZone.cost,
                    enabled: update.enabled ?? existingZone.enabled
                };
            }
            return existingZone.toObject();
        });

        settings.shipping = updatedZones;

        await settings.save();
        return res.status(200).json({ message: 'Zones de livraison mises à jour.', shipping: settings.shipping });

    } catch (error) {
        console.error("Erreur lors de la mise à jour de la livraison:", error);
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la livraison.' });
    }
};

/**
 * @route PUT /api/settings/notifications
 * Met à jour les paramètres de notifications.
 */
export const updateNotificationSettings = async (req, res) => {
    const { newOrderEmail, lowStockAlert, paymentFailureSMS } = req.body;

    try {
        const settings = await getStoreSettings();


        settings.notifications = {
            ...settings.notifications.toObject(),
            newOrderEmail: newOrderEmail ?? settings.notifications.newOrderEmail,
            lowStockAlert: lowStockAlert ?? settings.notifications.lowStockAlert,
            paymentFailureSMS: paymentFailureSMS ?? settings.notifications.paymentFailureSMS,
        };

        await settings.save();
        return res.status(200).json({ message: 'Paramètres de notifications mis à jour.', notifications: settings.notifications });

    } catch (error) {
        console.error("Erreur lors de la mise à jour des notifications:", error);
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour des notifications.' });
    }
};
