
// Importe la bibliothèque mongoose pour gérer la connexion à MongoDB
const mongoose = require('mongoose');

// Importe dotenv pour charger les variables d'environnement depuis le fichier .env
const dotenv = require('dotenv');
// Charge les variables d'environnement (comme MONGO_URI)
dotenv.config();


// Fonction asynchrone pour se connecter à la base de données MongoDB
const connectDB = async () => {
  try {
    // Tente de se connecter à MongoDB avec l'URL définie dans .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,      // Utilise le nouveau parseur d'URL
      useUnifiedTopology: true,   // Utilise le nouveau moteur de gestion des connexions
    });
    // Affiche un message si la connexion réussit
    console.log('MongoDB connecté');
  } catch (err) {
    // Affiche un message d'erreur si la connexion échoue
    console.error('Erreur de connexion MongoDB:', err.message);
    // Arrête le serveur en cas d'échec
    process.exit(1);
  }
};


// Exporte la fonction pour pouvoir l'utiliser dans d'autres fichiers
module.exports = connectDB;
