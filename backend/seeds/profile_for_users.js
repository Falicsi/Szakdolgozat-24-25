const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');

mongoose.connect('mongodb://localhost:27017/digital_event_planner');

async function createMissingProfiles() {
  const users = await User.find();
  for (const user of users) {
    const existing = await Profile.findOne({ user: user._id });
    if (!existing) {
      const profile = await Profile.create({
        user: user._id,
        fullName: user.username ? `Teszt ${user.username}` : 'Teszt Felhasználó',
        avatarUrl: 'https://i.pravatar.cc/150?u=' + user._id,
        bio: 'Ez egy teszt bemutatkozás.'
      });
      console.log(`Profil létrehozva: ${user.email}`);
    } else {
      // Ha már van profil, frissítsük dummy adatokkal
      await Profile.updateOne(
        { _id: existing._id },
        {
          fullName: user.username ? `Teszt ${user.username}` : 'Teszt Felhasználó',
          avatarUrl: 'https://i.pravatar.cc/150?u=' + user._id,
          bio: 'Ez egy teszt bemutatkozás.'
        }
      );
      console.log(`Profil frissítve: ${user.email}`);
    }
  }
  mongoose.disconnect();
}

createMissingProfiles().catch(err => {
  console.error(err);
  mongoose.disconnect();
});