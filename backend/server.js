require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const connectDB    = require('./db');
const invitationsRouter = require('./routes/invitations');
const categoriesRouter  = require('./routes/categories');
const notificationsRouter = require('./routes/notifications');
const resourcesRouter     = require('./routes/resources');
const rolesRouter         = require('./routes/roles');
const profilesRouter      = require('./routes/profiles');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();  

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/events', require('./routes/events'));
app.use('/api/invitations', invitationsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/roles',         rolesRouter);
app.use('/api/profiles',     profilesRouter);

app.listen(PORT, () => console.log(`Szerver fut a következő porton: ${PORT}`));
