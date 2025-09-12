const Feedback = require('../models/Feedback');

exports.create = async (req, res, next) => {
  try {
    const { name, email, message, contact } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Le message est requis.' });
    }

    const feedback = new Feedback({
      name: (name || '').trim(),
      email: (email || '').trim(),
      message: message.trim(),
      contact: (contact || '').trim(),
      user: req.user ? req.user.id || req.user._id : undefined
    });

    await feedback.save();
    return res.status(201).json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};
