import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../firebase';
import { Event, Invitation } from '../types';

const eventsCol = db.collection('events');
const invitationsCol = db.collection('invitations');

export const listEvents = async (_req: Request, res: Response): Promise<void> => {
  const snap = await eventsCol.get();
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Event) }));
  res.json(items);
  return;
};

export const getEvent = async (req: Request, res: Response): Promise<void> => {
  const doc = await eventsCol.doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Event not found');
    return;
  }
  res.json({ id: doc.id, ...(doc.data() as Event) });
  return;
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const data = req.body as Event;
  const ref  = await eventsCol.add(data);

  // Meghívók létrehozása
  const invitedUsers: string[] = data.invitedUsers || [];

  // Szervezőnek accepted invitation
  await invitationsCol.add({
    eventId: ref.id,
    userId: data.createdBy, // e-mail cím!
    status: 'accepted'
  });

  // Meghívottaknak pending invitation
  for (const email of invitedUsers) {
    if (email !== data.createdBy) {
      await invitationsCol.add({
        eventId: ref.id,
        userId: email, // e-mail cím!
        status: 'pending'
      });
    }
  }

  res.status(201).json({ id: ref.id });
  return;
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<Event> = req.body;
  await eventsCol.doc(req.params.id).set(data, { merge: true });

  // Meghívók frissítése
  const invitedUsers: string[] = data.invitedUsers || [];
  const snap = await invitationsCol.where('eventId', '==', req.params.id).get();
  const existingInvs = snap.docs.map(d => ({ id: d.id, ...(d.data() as Invitation) }));

  // Meghívottak, akik már nincsenek a listában: törlés
  for (const inv of existingInvs) {
    if (inv.userId !== data.createdBy && !invitedUsers.includes(inv.userId)) {
      await invitationsCol.doc(inv.id).delete();
    }
  }
  // Új meghívottak: invitation létrehozása
  for (const email of invitedUsers) {
    if (
      email !== data.createdBy &&
      !existingInvs.some(inv => inv.userId === email)
    ) {
      await invitationsCol.add({
        eventId: req.params.id,
        userId: email,
        status: 'pending'
      });
    }
  }

  res.json({ id: req.params.id });
  return;
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    await eventsCol.doc(req.params.id).delete();
    // Meghívók törlése
    const snap = await invitationsCol.where('eventId', '==', req.params.id).get();
    for (const doc of snap.docs) {
      await invitationsCol.doc(doc.id).delete();
    }
    res.status(204).end();
  } catch (err) {
    console.error('Esemény törlés hiba:', err);
    res.status(500).json({ message: 'Delete failed', error: (err as any).message });
  }
};
