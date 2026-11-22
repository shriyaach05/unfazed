const Therapist = require('../models/Therapist');

// Logged-in therapist reads their own profile
exports.getMyProfile = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.therapistId).select('-password_hash');
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });
    res.json(therapist);
  } catch (err) {
    next(err);
  }
};

// Logged-in therapist edits their profile
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { name, bio, specializations, languages } = req.body;

    const therapist = await Therapist.findByIdAndUpdate(
      req.therapistId,
      { name, bio, specializations, languages },
      { new: true, runValidators: true }
    ).select('-password_hash');

    res.json(therapist);
  } catch (err) {
    next(err);
  }
};

// Anyone can read a public profile by slug
exports.getPublicProfile = async (req, res, next) => {
  try {
    const therapist = await Therapist.findOne({ slug: req.params.slug }).select(
      'name slug bio specializations languages' // ONLY these fields leave the server
    );
    if (!therapist) return res.status(404).json({ message: 'Profile not found' });
    res.json(therapist);
  } catch (err) {
    next(err);
  }
};