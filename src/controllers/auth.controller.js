// src/controllers/auth.controller.ts
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign(
            { _id: user._id, roles: user.roles, email: user.email, name: user.name || "" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Connexion réussie",
            token, // 🔹 frontend pose le cookie
            user: { id: user._id, email: user.email, roles: user.roles, name: user.name || "" },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * POST /api/auth/logout
 * - Simple message, frontend supprime le cookie
 */
export const logoutUser = async (req, res) => {
    try {
        res.json({ success: true, message: "Déconnexion réussie côté serveur. Frontend doit supprimer le cookie." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur lors de la déconnexion." });
    }
};

/**
 * GET /api/auth/session
 * - Endpoint legacy (optionnel)
 * - Pour Next.js, la session est lue via session.server.ts
 */
export const getSession= async (req, res) => {
    res.status(400).json({ message: "Utiliser /api/auth/session côté Next.js pour la session." });
};
