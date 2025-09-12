
// Middleware de logs
// Il affiche dans la console chaque requête reçue par le serveur
module.exports = (req, res, next) => {
  // Affiche la méthode HTTP, l'URL et la date/heure de la requête
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  // Passe à la suite (route ou middleware suivant)
  next();
};
