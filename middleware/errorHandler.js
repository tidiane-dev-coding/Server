
// Middleware de gestion des erreurs
// Il intercepte toutes les erreurs qui surviennent dans l'application
module.exports = (err, req, res, next) => {
  // Affiche la pile d'erreur dans la console pour le développeur
  console.error(err.stack);
  // Renvoie une réponse JSON avec le message d'erreur et le code d'état
  res.status(err.status || 500).json({
    // Affiche le message d'erreur si disponible, sinon 'Erreur serveur'
    message: err.message || 'Erreur serveur',
  });
};
