require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const connectDB    = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();  

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/events', require('./routes/events'));

app.listen(PORT, () => console.log(`Szerver fut a következő porton: ${PORT}`));
