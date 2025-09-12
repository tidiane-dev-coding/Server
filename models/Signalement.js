
// Importe la bibliothèque mongoose pour gérer les schémas et la base MongoDB
const mongoose = require('mongoose');


// Définition du schéma d'un signalement (structure d'un document dans MongoDB)
const SignalementSchema = new mongoose.Schema({
  // Type d'incident (bouchon, accident, travaux, autre)
  type: {
    type: String, // le type est une chaîne de caractères
    required: true, // obligatoire
    // Étendu pour accepter tous les libellés issus du frontend (normalisés en minuscules)
    enum: [
      'bouchon',
      'accident',
      'travaux',
      'police',
      'voie bloquee',
      'zone scolaire',
      'mauvais temps',
      'animal',
      'vehicule en panne',
      'manifestation',
      'route glissante',
      'autre'
    ], // valeurs autorisées
  },
  // Description textuelle de l'incident
  description: {
    type: String, // texte
    required: true, // obligatoire
  },
  // Position GPS de l'incident
  position: {
    latitude: { type: Number, required: true }, // latitude (obligatoire)
    longitude: { type: Number, required: true }, // longitude (obligatoire)
  },
  // Date du signalement (par défaut la date actuelle)
  date: {
    type: Date,
    default: Date.now,
  },
  // Référence à l'utilisateur qui a signalé (optionnel)
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId, // identifiant MongoDB
    ref: 'Utilisateur', // référence au modèle Utilisateur
    required: false,
  },
  // Quartier détecté automatiquement (optionnel)
  quartier: {
    type: String,
    required: false,
  },
});


// Exporte le modèle Signalement pour pouvoir l'utiliser dans les contrôleurs
module.exports = mongoose.model('Signalement', SignalementSchema);
