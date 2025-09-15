
// Importe la bibliothèque mongoose pour gérer les schémas et la base MongoDB
const mongoose = require('mongoose');
// Importe bcryptjs pour hacher les mots de passe
const bcrypt = require('bcryptjs');


// Définition du schéma d'un utilisateur (structure d'un document dans MongoDB)
const UtilisateurSchema = new mongoose.Schema({
  // Nom de l'utilisateur
  nom: { type: String, required: true },
  // Email de l'utilisateur (doit être unique)
  email: { type: String, required: true, unique: true },
  // Mot de passe (sera haché avant d'être enregistré)
  motDePasse: { type: String, required: true },
  // Rôle de l'utilisateur (admin ou user)
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});


// Avant de sauvegarder un utilisateur, on hache le mot de passe si il a été modifié
UtilisateurSchema.pre('save', async function (next) {
  // Si le mot de passe n'a pas changé, on continue sans rien faire
  if (!this.isModified('motDePasse')) return next();
  // On hache le mot de passe avec bcrypt (10 tours de hachage)
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  // On continue la sauvegarde
  next();
});


// Exporte le modèle Utilisateur pour pouvoir l'utiliser dans les contrôleurs
module.exports = mongoose.model('Utilisateur', UtilisateurSchema);
