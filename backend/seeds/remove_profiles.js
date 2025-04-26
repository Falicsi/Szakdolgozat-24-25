const mongoose = require('mongoose');
const Profile = require('../models/Profile');

mongoose.connect('mongodb://localhost:27017/digital_event_planner');

async function deleteAllProfiles() {
  const result = await Profile.deleteMany({});
  console.log(`Törölt profilok száma: ${result.deletedCount}`);
  mongoose.disconnect();
}

deleteAllProfiles().catch(err => {
  console.error(err);
  mongoose.disconnect();
});