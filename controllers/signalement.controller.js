
// Importe le modèle Signalement pour interagir avec la collection MongoDB
const Signalement = require('../models/Signalement');


// Liste des quartiers de Conakry avec leur centre GPS (utilisé pour la détection automatique)
const quartiers = [
  { nom: 'Kagbélen', lat: 9.6745, lng: -13.5754 },
  { nom: 'Cimenterie', lat: 9.6483, lng: -13.5801 },
  { nom: 'T8', lat: 9.6362, lng: -13.5917 },
  { nom: 'Sonfonia', lat: 9.6204, lng: -13.6044 },
  { nom: 'Rail', lat: 9.6144, lng: -13.6095 },
  { nom: 'Marché', lat: 9.6100, lng: -13.6142 },
  { nom: 'Cité', lat: 9.6033, lng: -13.6201 },
  { nom: 'Cosa', lat: 9.5988, lng: -13.6242 },
  { nom: 'Bambéto', lat: 9.5921, lng: -13.6284 },
  { nom: 'Camayenne', lat: 9.5389, lng: -13.6826 },
  { nom: 'Kaloum', lat: 9.5131, lng: -13.7159 },
  { nom: 'Nongo', lat: 9.6244, lng: -13.6265 },
  { nom: 'Kipé', lat: 9.6052, lng: -13.6507 },
];


// Fonction pour détecter le quartier à partir des coordonnées GPS
function getQuartier(latitude, longitude) {
  const rayon = 1; // Rayon de détection en kilomètres
  // Fonction pour calculer la distance entre deux points GPS (formule de Haversine)
  function distance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  // Parcourt chaque quartier pour voir si le signalement est dans le rayon
  for (const q of quartiers) {
    if (distance(latitude, longitude, q.lat, q.lng) <= rayon) {
      return q.nom; // Retourne le nom du quartier détecté
    }
  }
  return 'Inconnu'; // Si aucun quartier n'est trouvé
}


// Crée un nouveau signalement et le sauvegarde dans la base de données
exports.createSignalement = async (req, res, next) => {
  try {
    // Récupère les données envoyées par le client
    const { type, description, latitude, longitude, utilisateur } = req.body;
    // Détecte le quartier automatiquement
    const quartier = getQuartier(latitude, longitude);
    // Crée un nouvel objet Signalement
    const signalement = new Signalement({
      type, // type d'incident
      description, // description de l'incident
      position: { latitude, longitude }, // coordonnées GPS
      utilisateur, // utilisateur (optionnel)
      quartier, // quartier détecté
    });
    // Sauvegarde le signalement dans MongoDB
    await signalement.save();
    // Renvoie le signalement créé au client
    res.status(201).json(signalement);
  } catch (err) {
    // Passe l'erreur au middleware de gestion des erreurs
    next(err);
  }
};


// Récupère tous les signalements enregistrés
exports.getSignalements = async (req, res, next) => {
  try {
    // Cherche tous les signalements et ajoute les infos utilisateur si présent
    const signalements = await Signalement.find().populate('utilisateur');
    // Renvoie la liste au client
    res.json(signalements);
  } catch (err) {
    // Passe l'erreur au middleware de gestion des erreurs
    next(err);
  }
};


// Récupère un signalement précis par son identifiant
exports.getSignalementById = async (req, res, next) => {
  try {
    // Cherche le signalement par son id et ajoute les infos utilisateur
    const signalement = await Signalement.findById(req.params.id).populate('utilisateur');
    // Si le signalement n'existe pas, renvoie une erreur 404
    if (!signalement) return res.status(404).json({ message: 'Signalement non trouvé' });
    // Sinon, renvoie le signalement
    res.json(signalement);
  } catch (err) {
    // Passe l'erreur au middleware de gestion des erreurs
    next(err);
  }
};


// Supprime un signalement par son identifiant
exports.deleteSignalement = async (req, res, next) => {
  try {
    // Cherche et supprime le signalement par son id
    const signalement = await Signalement.findByIdAndDelete(req.params.id);
    // Si le signalement n'existe pas, renvoie une erreur 404
    if (!signalement) return res.status(404).json({ message: 'Signalement non trouvé' });
    // Sinon, confirme la suppression
    res.json({ message: 'Signalement supprimé' });
  } catch (err) {
    // Passe l'erreur au middleware de gestion des erreurs
    next(err);
  }
};


// Met à jour un signalement existant. Si les coordonnées sont modifiées,
// recalculer automatiquement le quartier associé.
exports.updateSignalement = async (req, res, next) => {
  try {
    // Récupère les champs envoyés par le client (mise à jour partielle supportée)
    const { type, description, latitude, longitude } = req.body;

    // Cherche le signalement existant
    const signalement = await Signalement.findById(req.params.id);
    if (!signalement) return res.status(404).json({ message: 'Signalement non trouvé' });

    // Met à jour les champs si fournis
    if (type !== undefined) signalement.type = type;
    if (description !== undefined) signalement.description = description;

    // Si latitude/longitude fournis, on met à jour la position et on recalcule le quartier
    if (latitude !== undefined && longitude !== undefined) {
      signalement.position = { latitude, longitude };
      signalement.quartier = getQuartier(latitude, longitude);
    }

    // Sauvegarde les changements
    await signalement.save();

    // Renvoie le signalement mis à jour
    res.json(signalement);
  } catch (err) {
    next(err);
  }
};


// Retourne les statistiques du nombre de signalements par quartier
exports.statsQuartiers = async (req, res, next) => {
  try {
    // Agrège les signalements par quartier et compte le total
    const stats = await Signalement.aggregate([
      { $group: { _id: '$quartier', total: { $sum: 1 } } }, // Regroupe par quartier
      { $sort: { total: -1 } }, // Trie du plus grand au plus petit
    ]);
    // Renvoie les statistiques au client
    res.json(stats);
  } catch (err) {
    // Passe l'erreur au middleware de gestion des erreurs
    next(err);
  }
};
