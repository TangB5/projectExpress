// src/controllers/auth.controller.ts
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config';

/**
 * POST /api/auth/login
 * Authentifie un utilisateur et place le JWT dans un cookie sécurisé
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Générer le JWT
        const token = jwt.sign(
            {
                _id: user._id,
                roles: user.roles || [],
                email: user.email,
                name: user.name || ""
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
            path: "/"
        });


        res.status(200).json({
            message: "Connexion réussie",
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles || [],
                name: user.name || ""
            },
        });
    } catch (error) {
        console.error("Erreur login:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * POST /api/auth/logout
 * Supprime le cookie d'authentification
 */
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("authToken", { path: "/" });
        res.status(200).json({
            success: true,
            message: "Déconnexion réussie."
        });
    } catch (error) {
        console.error("Erreur logout:", error);
        res.status(500).json({ success: false, message: "Erreur serveur lors de la déconnexion." });
    }
};

/**
 * GET /api/auth/session
 * Endpoint d'information sur la session (optionnel)
 */
export const getSession = async (req, res) => {
    res.status(400).json({
        message: "Utiliser /api/auth/session côté Next.js pour la session."
    });
};
