import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import { uploadFileToSupabase } from '../services/fileUploader.js';

const sendError = (res, status, message, errors = {}) => {
    res.status(status).json({ message, errors });
};

// --- Récupérer tous les utilisateurs ---
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// --- Récupérer un utilisateur par ID ---
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return sendError(res, 404, 'User not found');
        res.status(200).json(user);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// --- Créer un utilisateur ---
export const createUser = async (req, res) => {
    try {
        const { name, email, password, roles, phone, address, preferences } = req.body;

        const errors = {};
        if (!name) errors.name = "Le nom est requis";
        if (!email) errors.email = "L'email est requis";
        if (!password) errors.password = "Le mot de passe est requis";
        if (Object.keys(errors).length > 0) return res.status(400).json({ message: "Champs manquants", errors });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({
            message: "Cet email est déjà utilisé",
            errors: { email: ["Cet email est déjà utilisé"] }
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const validRoles = ["user", "admin"];
        let userRoles = ["user"];
        if (roles && Array.isArray(roles) && roles.every(r => validRoles.includes(r))) {
            userRoles = roles;
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            roles: userRoles,
            phone: phone || "",
            address: address || {},
            preferences: preferences || {},
        });

        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error("Erreur lors de la création d'utilisateur :", error);
        res.status(500).json({
            message: "Erreur serveur",
            errors: { general: ["Une erreur est survenue, réessayez plus tard."] }
        });
    }
};

// --- Mettre à jour un utilisateur (avec avatar upload) ---
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, preferences } = req.body;

        let updateData = { name, email, phone, address, preferences };

        // Gestion de l'upload avatar via Supabase si un fichier est fourni
        if (req.file) {
            try {
                const publicUrl = await uploadFileToSupabase(req.file);
                if (publicUrl) updateData.avatar = publicUrl;
            } catch (err) {
                return sendError(res, 500, "Erreur lors de l'upload de l'avatar", { details: err.message });
            }
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) return sendError(res, 404, 'User not found');

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        sendError(res, 500, error.message);
    }
};

// --- Supprimer un utilisateur ---
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return sendError(res, 404, 'User not found');
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        sendError(res, 500, error.message);
    }
};
