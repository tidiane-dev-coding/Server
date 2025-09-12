
// Importe express pour gérer les routes HTTP
const express = require('express');
// Crée un nouvel objet router pour définir les routes
const router = express.Router();

// Importe le contrôleur des utilisateurs (fonctions pour chaque route)
const utilisateurCtrl = require('../controllers/utilisateur.controller');
// Importe le middleware d'authentification JWT
const auth = require('../middleware/auth');


// Route pour créer un nouvel utilisateur (POST)
router.post('/', utilisateurCtrl.createUtilisateur);

// Route pour connecter un utilisateur et obtenir un token JWT (POST)
router.post('/login', utilisateurCtrl.login);

// Route pour déconnecter un utilisateur (efface le cookie token)
router.post('/logout', utilisateurCtrl.logout);

// Route pour supprimer un utilisateur par son id (DELETE, protégé par JWT)
router.delete('/:id', auth, utilisateurCtrl.deleteUtilisateur);

// Route pour modifier un utilisateur par son id (PUT, protégé par JWT)
router.put('/:id', auth, utilisateurCtrl.updateUtilisateur);


// Exporte le router pour pouvoir l'utiliser dans le serveur principal
module.exports = router;
