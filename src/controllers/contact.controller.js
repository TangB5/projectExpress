import { getStoreSettings } from './settings.controller.js';
import nodemailer from 'nodemailer';

// =====================
// GET /contact
// =====================
export const getContactInfo = async (req, res) => {
    try {
        const settings = await getStoreSettings();

        if (!settings) return res.status(404).json({ message: 'Paramètres non trouvés' });

        const contact = {
            address: settings.general.address,
            phone: settings.general.phone,
            email: settings.general.email,
            social: {
                facebook: settings.general.facebook || '#',
                instagram: settings.general.instagram || '#',
                pinterest: settings.general.pinterest || '#',
            }
        };

        return res.status(200).json(contact);

    } catch (error) {
        console.error("Erreur getContactInfo:", error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// =====================
// POST /contact/send
// =====================
export const sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
        const settings = await getStoreSettings();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: settings.general.email, // destinataire = email du magasin
            subject: `[Contact Form] ${subject}`,
            text: message,
            html: `<p>${message}</p><p>De : ${name} - ${email}</p>`
        });

        res.status(200).json({ message: 'Email envoyé avec succès !' });
    } catch (error) {
        console.error("Erreur sendContactEmail:", error);
        res.status(500).json({ message: 'Erreur serveur lors de l’envoi de l’email.' });
    }
};
