import Settings from '../models/settings.model.js';

// =====================
// 🔹 Cache mémoire pour GET
// =====================
let cachedSettings = null;

// =====================
// 🔹 Helper pour récupérer/créer les settings
// =====================
export const getStoreSettings = async () => {
    if (cachedSettings) return cachedSettings;

    let settings = await Settings.findById('STORE_SETTINGS');
    if (!settings) {
        settings = new Settings({ _id: 'STORE_SETTINGS' });
        await settings.save();
    }

    cachedSettings = settings;
    return cachedSettings;
};

// =====================
// 🟢 GET /api/settings
// =====================
export const getSettings = async (req, res) => {
    try {
        const settings = await getStoreSettings();
        return res.status(200).json(settings);
    } catch (error) {
        console.error("Erreur getSettings:", error);
        return res.status(500).json({ message: error.message });
    }
};

// =====================
// ✏️ PUT /api/settings/general
// =====================
export const updateGeneralSettings = async (req, res) => {
    const { storeName, email, phone, address, currency, maintenance } = req.body;
    try {
        const settings = await getStoreSettings();

        if (currency && !['XAF', 'EUR', 'USD'].includes(currency)) {
            return res.status(400).json({ message: 'Devise non valide.' });
        }

        settings.general = {
            ...settings.general.toObject(),
            storeName: storeName ?? settings.general.storeName,
            email: email ?? settings.general.email,
            phone: phone ?? settings.general.phone,
            address: address ?? settings.general.address,
            currency: currency ?? settings.general.currency,
            maintenance: maintenance ?? settings.general.maintenance,
        };

        await settings.save();
        cachedSettings = null; // 🔄 Invalider le cache
        return res.status(200).json({ message: 'Paramètres généraux mis à jour.', general: settings.general });
    } catch (error) {
        console.error("Erreur updateGeneralSettings:", error);
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
    }
};


// =====================
// ✏️ PUT /api/settings/payments
// =====================
export const updatePaymentSettings = async (req, res) => {
    const newPaymentMethods = req.body;
    if (!Array.isArray(newPaymentMethods)) {
        return res.status(400).json({ message: 'Le corps de la requête doit être un tableau de méthodes de paiement.' });
    }

    try {
        const settings = await getStoreSettings();

        settings.payments = settings.payments.map(existingMethod => {
            const update = newPaymentMethods.find(m => m.id === existingMethod.id);
            return update ? { ...existingMethod.toObject(), enabled: update.enabled } : existingMethod.toObject();
        });

        await settings.save();
        cachedSettings = null; // 🔄 Invalider le cache
        return res.status(200).json({ message: 'Méthodes de paiement mises à jour.', payments: settings.payments });
    } catch (error) {
        console.error("Erreur updatePaymentSettings:", error);
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour des paiements.' });
    }
};

// =====================
// ✏️ PUT /api/settings/shipping
// =====================
export const updateShippingSettings = async (req, res) => {
    const newShippingZones = req.body;
    if (!Array.isArray(newShippingZones)) {
        return res.status(400).json({ message: 'Le corps de la requête doit être un tableau de zones de livraison.' });
    }

    try {
        const settings = await getStoreSettings();

        settings.shipping = settings.shipping.map(existingZone => {
            const update = newShippingZones.find(z => z.id === existingZone.id);
            return update
                ? { ...existingZone.toObject(), cost: update.cost ?? existingZone.cost, enabled: update.enabled ?? existingZone.enabled }
                : existingZone.toObject();
        });

        await settings.save();
        cachedSettings = null; // 🔄 Invalider le cache
        return res.status(200).json({ message: 'Zones de livraison mises à jour.', shipping: settings.shipping });
    } catch (error) {
        console.error("Erreur updateShippingSettings:", error);
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour des zones de livraison.' });
    }
};

// =====================
// ✏️ PUT /api/settings/notifications
// =====================
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
        cachedSettings = null; // 🔄 Invalider le cache
        return res.status(200).json({ message: 'Paramètres de notifications mis à jour.', notifications: settings.notifications });
    } catch (error) {
        console.error("Erreur updateNotificationSettings:", error);
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour des notifications.' });
    }
};
