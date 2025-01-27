// backend/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/digital_event_planner', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB kapcsolódás sikeres');
  } catch (error) {
    console.error('MongoDB kapcsolódási hiba:', error);
    process.exit(1); // Kilépés hiba esetén
  }
};

module.exports = connectDB;
