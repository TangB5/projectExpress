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
      { _id: user._id, roles: [user.role], email: user.email, name: user.name || "" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

   res.cookie("authToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.status(200).json({
      message: "Connexion réussie",
      user: { id: user._id, email: user.email, roles: user.role ? [user.role] : [] , name: user.name || "" },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const logoutUser = (req, res) => {
  try {
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Vous n'êtes pas connecté." });
    }

    res.cookie("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
      path: "/",
      expires: new Date(0), // Fait expirer le cookie immédiatement
    });

    res.json({ success: true, message: "Déconnexion réussie." });
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la déconnexion." });
  }
};

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
        roles: user.role ? [user.role] : [],
      },
    });
  } catch (error) {
    console.error("Erreur de vérification de session :", error);
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};