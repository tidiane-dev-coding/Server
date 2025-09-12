const express = require('express');
const router = express.Router();
const feedbackCtrl = require('../controllers/feedback.controller');

// POST /feedback -> créer un retour/utilisateur
router.post('/', feedbackCtrl.create);

module.exports = router;
