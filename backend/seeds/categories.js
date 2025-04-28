const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  { name: 'Meeting', description: 'Formal or informal meeting' },
  { name: 'Workshop', description: 'Hands-on learning event' },
  { name: 'Social', description: 'Casual social gathering' },
  { name: 'Webinar', description: 'Online seminar or presentation' },
  { name: 'Conference', description: 'Large formal event' },
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/digital_event_planner');
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log('Categories seeded');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
