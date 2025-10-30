import jwt from "jsonwebtoken";

// Middleware pour vérifier si un utilisateur est authentifié
export const requireAuth = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Aucun token d'authentification fourni." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expiré." });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token invalide." });
    }
    return res.status(401).json({ message: "Erreur d'authentification." });
  }
};

// Middleware pour vérifier le rôle de l'utilisateur
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles.includes(role)) {
      return res.status(403).json({ message: "Accès refusé. Vous n'avez pas le rôle requis." });
    }
    next();
  };
};