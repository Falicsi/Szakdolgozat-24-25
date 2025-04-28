const mongoose = require('mongoose');
const Resource = require('../models/Resource');

// Mongo URI, lehet ENV-ből is
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/digital_event_planner';

const resources = [
  { name: 'Projektor', type: 'Eszköz', capacity: null, location: 'Aula', description: 'Full HD projektor' },
  { name: 'Konferenciaterem', type: 'Helyszín', capacity: 50, location: 'Épület B, 2. em.', description: 'Ülésekhez' },
  { name: 'Hangsugárzó', type: 'Eszköz', capacity: null, location: 'Raktár', description: 'Beépített mikrofon bemenettel' }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Töröljük az előző adatokat
    await Resource.deleteMany({});
    console.log('Existing resources removed');

    // Beszúrjuk az újak
    await Resource.insertMany(resources);
    console.log('Resource seeding completed');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();