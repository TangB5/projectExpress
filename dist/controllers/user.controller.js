import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({
        message: 'User not found'
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
};
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;
    const errors = {};
    if (!name) errors.name = "Le nom est requis";
    if (!email) errors.email = "L'email est requis";
    if (!password) errors.password = "Le mot de passe est requis";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Champs manquants",
        errors
      });
    }
    const existingUser = await User.findOne({
      email
    });
    if (existingUser) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé",
        errors: {
          email: "Cet email est déjà utilisé"
        }
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Erreur lors de la création d'utilisateur :", error);
    res.status(500).json({
      message: "Erreur serveur",
      errors: {
        general: "Une erreur est survenue, réessayez plus tard."
      }
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true
    });
    if (!user) {
      return res.status(404).send({
        message: 'User not found'
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
};