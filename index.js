
// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importe express pour créer le serveur web
const express = require('express');
// Importe cors pour autoriser les requêtes depuis d'autres origines (sécurité)
const cors = require('cors');
// Importe body-parser pour lire le contenu JSON des requêtes
const bodyParser = require('body-parser');
// Importe cookie-parser pour gérer les cookies (tokens HttpOnly)
const cookieParser = require('cookie-parser');
// Importe la fonction de connexion à MongoDB
const connectDB = require('./config/db');
// Importe le middleware de logs
const logger = require('./middleware/logger');
// Importe le middleware de gestion des erreurs
const errorHandler = require('./middleware/errorHandler');

// Importe les routes pour les signalements
const signalementRoutes = require('./routes/signalement.routes');
// Importe les routes pour les utilisateurs
const utilisateurRoutes = require('./routes/utilisateur.routes');
// Routes pour les retours utilisateurs / feedback
const feedbackRoutes = require('./routes/feedback.routes');

// Crée l'application Express
const app = express();


// Active le middleware CORS pour accepter les requêtes externes
// Autorise dynamiquement le frontend local et le domaine déployé
const allowedOrigins = [
  'https://laawolkafu.onrender.com',
  'http://localhost:5173'
];
app.use(cors({
  origin: function (origin, callback) {
    // Autorise les requêtes sans origin (ex: mobile, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Active le middleware body-parser pour lire le JSON envoyé par le client
app.use(bodyParser.json());
// Active le middleware cookie-parser pour parser les cookies
app.use(cookieParser());
// Active le middleware de logs pour afficher chaque requête dans la console
app.use(logger);

// Si un cookie 'token' est présent, expose le token sur req.token pour compatibilité
app.use((req, res, next) => {
  if (req.cookies && req.cookies.token) {
    req.token = req.cookies.token;
  }
  next();
});


// Connecte l'application à la base de données MongoDB
connectDB();


// Définit la route /signalements pour gérer les signalements
app.use('/signalements', signalementRoutes);
// Définit la route /utilisateurs pour gérer les utilisateurs
app.use('/utilisateurs', utilisateurRoutes);
// Définit la route /feedback pour stocker les commentaires/retours
app.use('/feedback', feedbackRoutes);


// Active le middleware de gestion des erreurs pour intercepter toutes les erreurs
app.use(errorHandler);


// Définit le port d'écoute du serveur (depuis .env ou 5000 par défaut)
const PORT = process.env.PORT || 5000;
// Démarre le serveur Express et affiche un message dans la console
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
