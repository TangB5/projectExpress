import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const getCookieOptions = (isProduction, expires) => {
    const options = {
        httpOnly: true,
        path: "/",
        maxAge: expires ? undefined : 7 * 24 * 60 * 60 * 1000,
        expires: expires,
    };

    if (isProduction) {
        options.secure = true;
        options.sameSite = "none";
        options.domain = ".vercel.app";
    } else {
        options.secure = false;
        options.sameSite = "lax";
        // On laisse 'domain' à undefined pour localhost
    }

    return options;
};

// ====================================================================

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isProduction = process.env.NODE_ENV === "production";

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

        // Utilisation de la fonction utilitaire
        const cookieOptions = getCookieOptions(isProduction);
        res.cookie("authToken", token, cookieOptions);

        res.status(200).json({
            message: "Connexion réussie",
            user: { id: user._id, email: user.email, roles: user.roles, name: user.name || "" },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ====================================================================

export const logoutUser = (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        const token = req.cookies?.authToken;

        if (!token) {
            return res.status(401).json({ success: false, message: "Vous n'êtes pas connecté." });
        }

        // Utilisation de la fonction utilitaire avec une date d'expiration
        const cookieOptions = getCookieOptions(isProduction, new Date(0));
        res.cookie("authToken", "", cookieOptions);

        res.json({ success: true, message: "Déconnexion réussie." });
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
        res.status(500).json({ success: false, message: "Erreur serveur lors de la déconnexion." });
    }
};

// ====================================================================

export const getSession = async (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: "Aucun token d'authentification fourni." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Utilisateur non trouvé." });
        }

        res.status(200).json({
            user: {
                id: user._id.toString(),
                name: user.name || "",
                email: user.email,
                roles: user.roles,
            },
        });
    } catch (error) {
        console.error("Erreur de vérification de session :", error);
        return res.status(401).json({ message: "Token invalide ou expiré." });
    }
};