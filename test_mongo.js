// Petit script de test pour diagnostiquer la connexion MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  const uri = process.env.MONGO_URI;
  console.log('Using MONGO_URI:', uri ? '[REDACTED]' : 'MONGO_URI not set');
  try {
    // Timeout court pour ne pas bloquer trop longtemps
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 10000 });
    console.log('Connexion MongoDB réussie');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Erreur de connexion MongoDB:', err && err.message);
    if (err && err.stack) console.error(err.stack);
    process.exit(1);
  }
}

test();
