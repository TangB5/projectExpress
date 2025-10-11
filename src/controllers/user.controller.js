import User from '../models/user.model.js';
import bcrypt from "bcryptjs";

const sendError = (res, status, message, errors = {}) => {
    res.status(status).json({ message, errors });
};

// --- Contrôleurs ---

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return sendError(res, 404, 'User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

export const createUser = async (req, res) => {
    try {

        const { name, email, password, roles } = req.body;

        const errors = {};
        if (!name) errors.name = "Le nom est requis";
        if (!email) errors.email = "L'email est requis";
        if (!password) errors.password = "Le mot de passe est requis";


        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Champs manquants", errors });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Cet email est déjà utilisé",
                errors: { email: ["Cet email est déjà utilisé"] }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let userRoles = ["user"]; // Valeur par défaut
        const validRoles = ["user", "admin"];

        if (roles && Array.isArray(roles) && roles.length > 0) {
             const allRolesValid = roles.every(r => validRoles.includes(r));

             if (allRolesValid) {
                 userRoles = roles;
             } else {
                 console.warn("Tentative de création d'utilisateur avec des rôles non valides. Rôle par défaut appliqué.");
             }
        }



        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            roles: userRoles, // Utilisation de la variable 'userRoles' sécurisée
        });

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (error) {
        console.error("Erreur lors de la création d'utilisateur :", error);
        res.status(500).json({
            message: "Erreur serveur",
            errors: { general: ["Une erreur est survenue, réessayez plus tard."] }
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {

            return sendError(res, 404, 'User not found');
        }
        res.status(200).json(user);
    } catch (error) {

        sendError(res, 500, error.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return sendError(res, 404, 'User not found');
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        sendError(res, 500, error.message);
    }
};
