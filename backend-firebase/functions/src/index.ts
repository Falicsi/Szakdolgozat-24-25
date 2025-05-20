import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';

import * as userCtrl from './controllers/userController';
import * as roleCtrl from './controllers/roleController';
import * as categoryCtrl from './controllers/categoryController';
import * as resourceCtrl from './controllers/resourceController';
import * as eventCtrl from './controllers/eventController';
import * as invitationCtrl from './controllers/invitationController';
import { firebaseAuth, requireAdmin } from './middleware/firebaseAuth';

const app = express();
app.use(cors({ origin: true })); // vagy origin: ['http://localhost:4200'], credentials: true
app.options('*', cors());
app.use(express.json());

// Users
app.get('/users', userCtrl.listUsers);
app.get('/users/:id', userCtrl.getUser);
app.post('/users', userCtrl.createUser);
app.put('/users/:id', userCtrl.updateUser);
app.delete('/users/:id', userCtrl.deleteUser);

// Roles
app.get('/roles', roleCtrl.listRoles);
app.get('/roles/:id', roleCtrl.getRole);
app.post('/roles', roleCtrl.createRole);
app.put('/roles/:id', roleCtrl.updateRole);
app.delete('/roles/:id', roleCtrl.deleteRole);

// Categories
app.get('/categories', firebaseAuth, categoryCtrl.listCategories);
app.get('/categories/:id', firebaseAuth, categoryCtrl.getCategory);
app.post('/categories', firebaseAuth, requireAdmin, categoryCtrl.createCategory);
app.put('/categories/:id', firebaseAuth, requireAdmin, categoryCtrl.updateCategory);
app.delete('/categories/:id', firebaseAuth, requireAdmin, categoryCtrl.deleteCategory);

// Resources
app.get('/resources', resourceCtrl.listResources);
app.get('/resources/:id', resourceCtrl.getResource);
app.post('/resources', resourceCtrl.createResource);
app.put('/resources/:id', resourceCtrl.updateResource);
app.delete('/resources/:id', resourceCtrl.deleteResource);

// Events
app.get('/events', eventCtrl.listEvents);
app.get('/events/:id', eventCtrl.getEvent);
app.post('/events', eventCtrl.createEvent);
app.put('/events/:id', eventCtrl.updateEvent);
app.delete('/events/:id', eventCtrl.deleteEvent);

// Invitations
app.get('/invitations', invitationCtrl.listInvitations);
app.get('/invitations/:id', invitationCtrl.getInvitation);
app.post('/invitations', invitationCtrl.createInvitation);
app.put('/invitations/:id', invitationCtrl.updateInvitation);
app.delete('/invitations/:id', invitationCtrl.deleteInvitation);

export const api = functions.https.onRequest(app);
