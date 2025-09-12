
// Importe le modèle Utilisateur pour interagir avec la collection MongoDB
const Utilisateur = require('../models/Utilisateur');
// Importe jsonwebtoken pour gérer l'authentification par token
const jwt = require('jsonwebtoken');
// Importe bcryptjs pour le hachage et la vérification des mots de passe
const bcrypt = require('bcryptjs');


// Crée un nouvel utilisateur et le sauvegarde dans la base de données
exports.createUtilisateur = async (req, res, next) => {
  try {
    // Récupère les données envoyées par le client
    const { nom, email, motDePasse } = req.body;
    // Crée un nouvel objet Utilisateur
    const utilisateur = new Utilisateur({ nom, email, motDePasse });
    // Sauvegarde l'utilisateur dans MongoDB (le mot de passe est haché automatiquement)
    await utilisateur.save();
    // Renvoie l'utilisateur créé au client
    res.status(201).json(utilisateur);
  } catch (err) {
    // Si l'email existe déjà, renvoie une erreur spécifique
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    // Passe l'erreur au middleware de gestion des erreurs
    next(err);
  }
};



// Connecte un utilisateur et renvoie un token JWT si les identifiants sont corrects
exports.login = async (req, res, next) => {
  try {
    // Récupère les identifiants envoyés par le client
    const { email, motDePasse } = req.body;
    // Cherche l'utilisateur par son email
    const utilisateur = await Utilisateur.findOne({ email });
    // Si l'utilisateur n'existe pas, renvoie une erreur
    if (!utilisateur) return res.status(400).json({ message: 'Utilisateur non trouvé' });
    // Vérifie que le mot de passe envoyé correspond au mot de passe haché en base
    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    // Si le mot de passe est incorrect, renvoie une erreur
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });
    // Génère un token JWT contenant l'id et l'email de l'utilisateur, valable 24h
    const token = jwt.sign({ id: utilisateur._id, email: utilisateur.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    // Définir le token dans un cookie HttpOnly pour que le navigateur l'envoie automatiquement
    // secure: true en production (HTTPS), sameSite: 'lax' pour protéger contre CSRF simple
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 heures
    });
    // Renvoie l'utilisateur au client (le token est dans le cookie)
    res.json({ utilisateur });
  } catch (err) {
    // Passe l'erreur au middleware de gestion des erreurs
    next(err);
  }
};

// Déconnecte l'utilisateur en effaçant le cookie
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Déconnecté' });
  } catch (err) {
    next(err);
  }
};


// Supprime un utilisateur par son identifiant
exports.deleteUtilisateur = async (req, res, next) => {
  try {
    // Cherche et supprime l'utilisateur par son id (reçu dans l'URL)
    const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);
    // Si l'utilisateur n'existe pas, renvoie une erreur 404
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    // Sinon, confirme la suppression
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    // Passe l'erreur au middleware de gestion des erreurs
    next(err);
  }
};

// Modifie un utilisateur par son identifiant
exports.updateUtilisateur = async (req, res, next) => {
  try {
    // Copie des champs envoyés
    const updates = { ...req.body };
    // Si le mot de passe est présent dans la mise à jour, on le hache manuellement
    if (updates.motDePasse) {
      updates.motDePasse = await bcrypt.hash(updates.motDePasse, 10);
    }
    // Met à jour l'utilisateur et renvoie le document mis à jour
    const utilisateur = await Utilisateur.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(utilisateur);
  } catch (err) {
    next(err);
  }
};
