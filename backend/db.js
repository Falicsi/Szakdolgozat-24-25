require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB kapcsolódás sikeres');
  } catch (error) {
    console.error('MongoDB kapcsolódási hiba:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
