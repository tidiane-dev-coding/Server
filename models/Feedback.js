const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  message: { type: String, required: true },
  contact: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
