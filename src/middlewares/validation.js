// Middleware de validation pour les requêtes

export const validateProductInput = (req, res, next) => {
  const { name, category, price } = req.body;

  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Le nom du produit est requis');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('La catégorie est requise');
  }

  if (!price || isNaN(Number(price)) || Number(price) < 0) {
    errors.push('Le prix doit être un nombre positif');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation échouée', errors });
  }

  next();
};

export const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  
  const errors = [];

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Email valide requis');
  }

  if (!password || password.length < 6) {
    errors.push('Mot de passe requis (minimum 6 caractères)');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation échouée', errors });
  }

  next();
};

export const validateMongoId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'ID MongoDB invalide' });
  }
  
  next();
};
