require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Therapist = require('./src/models/Therapist');
const generateUniqueSlug = require('./src/utils/generateSlug');

const sampleTherapists = [
  {
    name: 'Dr. Anita Sharma',
    email: 'anita@seed.test',
    bio: 'Clinical psychologist with 10 years of experience helping adults with anxiety and stress.',
    specializations: ['Anxiety', 'Stress', 'Burnout'],
    languages: ['English', 'Hindi'],
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul@seed.test',
    bio: 'Counsellor focused on relationships and life transitions.',
    specializations: ['Relationships', 'Career Counselling'],
    languages: ['English', 'Gujarati'],
  },
  {
    name: 'Dr. Priya Nair',
    email: 'priya@seed.test',
    bio: 'Child and adolescent therapist using play-based and CBT approaches.',
    specializations: ['Child Therapy', 'ADHD Support', 'Teen Counselling'],
    languages: ['English', 'Malayalam', 'Kannada'],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Only remove OLD seed data, never real accounts
  await Therapist.deleteMany({ email: /@seed\.test$/ });

  const password_hash = await bcrypt.hash('password123', 10);

  for (const t of sampleTherapists) {
    const slug = await generateUniqueSlug(t.name);
    await Therapist.create({ ...t, password_hash, slug });
  }

  console.log(`Seeded ${sampleTherapists.length} therapists (password: password123)`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});