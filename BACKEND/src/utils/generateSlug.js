const Therapist = require('../models/Therapist');
const RESERVED = ['login', 'register', 'dashboard', 'api', 'admin'];

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(name) {
    const base = slugify(name);
    let slug = base;
    let count = 2; 

    // checkin slug exists in db
    while (RESERVED.includes(slug) || await Therapist.exists({ slug }) ) {
        slug = `${base}-${count}`; // if exists, append a num to make it unique
        count++;
    }
    return slug;
}

module.exports = generateUniqueSlug;