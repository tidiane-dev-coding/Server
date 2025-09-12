
// Importe express pour gérer les routes HTTP
const express = require('express');
// Crée un nouvel objet router pour définir les routes
const router = express.Router();
// Importe le contrôleur des signalements (fonctions pour chaque route)
const signalementCtrl = require('../controllers/signalement.controller');
// Importe le middleware d'authentification JWT
const auth = require('../middleware/auth');


// Route pour créer un nouveau signalement (POST)
router.post('/', signalementCtrl.createSignalement);

// Route pour obtenir tous les signalements (GET)
router.get('/', signalementCtrl.getSignalements);

// Route pour obtenir les statistiques par quartier (GET)
// NB: placé avant la route paramétrée pour éviter que 'stats' soit interprété
// comme un id par express (ordre des routes important)
router.get('/stats/quartiers', signalementCtrl.statsQuartiers);

// Route pour obtenir un signalement spécifique par son id (GET)
router.get('/:id', signalementCtrl.getSignalementById);

// Route pour mettre à jour un signalement existant (PUT, protégé par JWT)
// NOTE: auth retiré pour permettre les mises à jour publiques (déconseillé en production)
router.put('/:id', signalementCtrl.updateSignalement);

// Route pour supprimer un signalement (DELETE) — retiré auth pour faciliter les tests locaux
router.delete('/:id', signalementCtrl.deleteSignalement);


// Exporte le router pour pouvoir l'utiliser dans le serveur principal
module.exports = router;
