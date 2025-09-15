// Script pour mettre à jour le champ 'role' dans tous les utilisateurs
// Attribue 'admin' à ton email, 'user' aux autres

const mongoose = require('mongoose');
const Utilisateur = require('./models/Utilisateur');

const MONGO_URI = 'mongodb+srv://Bahamadoutidiane622292370:Bahsow64@cluster0.niqycgy.mongodb.net/laawol_kafu'; // Remplace par l'URL de ta base
const TON_EMAIL = 'bahamadoutidiane622292370@gmail.com'; // Remplace par ton email

async function updateRoles() {
  await mongoose.connect(MONGO_URI);
  // Met à jour ton compte en admin
  await Utilisateur.updateOne({ email: TON_EMAIL }, { $set: { role: 'admin' } });
  // Met à jour tous les autres en user
  await Utilisateur.updateMany({ email: { $ne: TON_EMAIL } }, { $set: { role: 'user' } });
  console.log('Mise à jour des rôles terminée.');
  await mongoose.disconnect();
}

updateRoles().catch(console.error);
