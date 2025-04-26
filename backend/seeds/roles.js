const mongoose = require('mongoose');
const Role = require('../models/Role');

mongoose.connect('mongodb://localhost:27017/digital_event_planner', { useNewUrlParser: true, useUnifiedTopology: true });

const roles = [
  { name: 'admin', description: 'Admin oldalhoz hozzáférés' },
  { name: 'organizer', description: 'Események létrehozásának joga' },
  { name: 'user', description: 'Események elfogadása / elutasítása' }
];

Role.insertMany(roles)
  .then(() => {
    console.log('Alap szerepkörök feltöltve!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });