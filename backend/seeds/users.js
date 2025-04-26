const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Role = require('../models/Role');

mongoose.connect('mongodb://localhost:27017/digital_event_planner');

async function seed() {
  // Lekérjük a role-okat név szerint
  const adminRole     = await Role.findOne({ name: 'admin' });
  const organizerRole = await Role.findOne({ name: 'organizer' });
  const userRole      = await Role.findOne({ name: 'user' });

  const users = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: adminRole._id
    },
    {
      username: 'organizer',
      email: 'organizer@example.com',
      password: await bcrypt.hash('organizer123', 10),
      role: organizerRole._id
    },
    {
      username: 'user',
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      role: userRole._id
    }
  ];

  await User.deleteMany({
    $or: [
      { email: { $in: users.map(u => u.email) } },
      { username: { $in: users.map(u => u.username) } }
    ]
  });

  await User.insertMany(users);
  console.log('Alap userek feltöltve!');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
});