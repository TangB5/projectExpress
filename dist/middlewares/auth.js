import jwt from "jsonwebtoken";

// Middleware pour vérifier si un utilisateur est authentifié
export const requireAuth = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({
      message: "Accès refusé. Aucun token d'authentification fourni."
    });
  }
  try {
    // Vérifie le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute les informations de l'utilisateur à l'objet de requête
    next(); // Passe au middleware ou au contrôleur suivant
  } catch (error) {
    res.status(401).json({
      message: "Token invalide ou expiré."
    });
  }
};

// Middleware pour vérifier le rôle de l'utilisateur
export const requireRole = role => {
  return (req, res, next) => {
    // req.user est défini par le middleware requireAuth
    if (!req.user || !req.user.roles.includes(role)) {
      return res.status(403).json({
        message: "Accès refusé. Vous n'avez pas le rôle requis."
      });
    }
    next(); // Passe au middleware ou au contrôleur suivant
  };
};