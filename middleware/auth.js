
// Importe la bibliothèque jsonwebtoken pour gérer les tokens JWT
const jwt = require('jsonwebtoken');


// Middleware d'authentification pour protéger les routes
module.exports = (req, res, next) => {
  // Tentative de lecture du token depuis l'en-tête Authorization (Bearer ...) ou depuis req.token (défini par cookie-parser)
  let token = req.header('Authorization');
  if (token) token = token.replace('Bearer ', '');
  else if (req.token) token = req.token;
  else if (req.cookies && req.cookies.token) token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    // Vérifie et décode le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ajoute les infos de l'utilisateur décodé à la requête
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
