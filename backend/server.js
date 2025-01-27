const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/digital-event-planner', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB-hez csatlakozva!'))
  .catch((error) => console.error('MongoDB kapcsolat hiba:', error));

app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Szerver fut a következő porton: ${PORT}`));
