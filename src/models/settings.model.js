import mongoose from 'mongoose';

// =====================
// 🧩 Sous-schémas
// =====================

// Méthodes de paiement
const PaymentMethodSchema = new mongoose.Schema({
    id: { type: String, required: true }, // ❌ pas de unique ici
    name: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    description: { type: String },
    isMobileMoney: { type: Boolean, default: false },
}, { _id: false });

// Zones de livraison
const ShippingZoneSchema = new mongoose.Schema({
    id: { type: String, required: true }, // ❌ pas de unique ici non plus
    name: { type: String, required: true },
    cost: { type: Number, default: 0 },
    enabled: { type: Boolean, default: false },
}, { _id: false });

// Notifications
const NotificationSettingsSchema = new mongoose.Schema({
    newOrderEmail: { type: Boolean, default: true },
    lowStockAlert: { type: Boolean, default: true },
    paymentFailureSMS: { type: Boolean, default: false },
}, { _id: false });

// =====================
// 🧱 Schéma principal
// =====================
const SettingsSchema = new mongoose.Schema({
    _id: { type: String, default: 'STORE_SETTINGS' }, // ID fixe (singleton)

    general: {
        storeName: { type: String, required: true, default: 'ModerneMeuble Cameroun' },
        email: { type: String, required: true, default: 'contact@modernemeuble.cm' },
        phone: { type: String, default: '+237 6XX XX XX XX' },
        address: { type: String, default: 'Douala, Bonamoussadi, Rue 105' },
        currency: { type: String, enum: ['XAF', 'EUR', 'USD'], default: 'XAF' },
        maintenance: { type: Boolean, default: false },
    },

    payments: {
        type: [PaymentMethodSchema],
        default: () => ([
            { id: 'cash_on_delivery', name: 'Paiement à la livraison', enabled: true, description: 'Paiement en espèces lors de la réception.', isMobileMoney: false },
            { id: 'mtn_momo', name: 'MTN Mobile Money', enabled: true, description: 'Paiement via MTN Mobile Money.', isMobileMoney: true },
            { id: 'orange_money', name: 'Orange Money', enabled: true, description: 'Paiement via Orange Money.', isMobileMoney: true },
            { id: 'bank_transfer', name: 'Virement bancaire', enabled: false, description: 'Virement vers notre compte local.', isMobileMoney: false },
        ]),
    },

    shipping: {
        type: [ShippingZoneSchema],
        default: () => ([
            { id: 'douala', name: 'Douala', cost: 2000, enabled: true },
            { id: 'yaounde', name: 'Yaoundé', cost: 3500, enabled: true },
            { id: 'other_agencies', name: 'Autres Villes (Agences)', cost: 5000, enabled: false },
        ]),
    },

    notifications: {
        type: NotificationSettingsSchema,
        default: () => ({}),
    },

}, { timestamps: true });


// =====================
// ⚡ Méthode statique optimisée
// =====================

// Cache mémoire (évite les requêtes répétées)
let cachedSettings = null;

SettingsSchema.statics.getSettings = async function () {

    if (cachedSettings) return cachedSettings;


    let settings = await this.findById('STORE_SETTINGS').lean();

    if (!settings) {
        const newSettings = new this({ _id: 'STORE_SETTINGS' });
        const saved = await newSettings.save();
        settings = saved.toObject();
    }


    cachedSettings = settings;
    return settings;
};

// Permet d’invalider le cache après une mise à jour
SettingsSchema.statics.invalidateCache = function () {
    cachedSettings = null;
};

const Settings = mongoose.model('Settings', SettingsSchema);
export default Settings;
