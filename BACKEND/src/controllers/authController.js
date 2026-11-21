const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Therapist = require('../models/Therapist');
const generateUniqueSlug = require('../utils/generateSlug');

function createToken(therapist) {
  return jwt.sign({ id: therapist._id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // token expires in 7 days
  });
}

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body; // destructuring the request body to get name, email n pw

    const existing = await Therapist.findOne({ email });
    if (existing) {
        return res.status(409).json({ message: 'Email already registered' }); // 409 = conflict
    }

    const password_hash = await bcrypt.hash(password, 10); // 10 = how strong the scrambling is
    const slug = await generateUniqueSlug(name); // generates a unique slug based on the therapist's name

    const therapist = await Therapist.create({ name, email, password_hash, slug }); // creatin new therapist in db

    res.status(201).json({
        token: createToken(therapist),
        therapist: { id: therapist._id, name: therapist.name, email: therapist.email, slug: therapist.slug },
    });
  } catch (err) {
    next(err); // sends the error to errorHandler.js
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // find the therapist by email
    const therapist = await Therapist.findOne({ email });
    if (!therapist) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // comparing the pw w hashed password stored in the db
    const match = await bcrypt.compare(password, therapist.password_hash);
    if (!match) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
        token: createToken(therapist),
        therapist: { id: therapist._id, name: therapist.name, email: therapist.email, slug: therapist.slug },
    });
  } catch (err) {
        next(err);
  }
};