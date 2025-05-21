import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../firebase';
import { Event } from '../types';

const eventsCol = db.collection('events');

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
  res.status(201).json({ id: ref.id });
  return;
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<Event> = req.body;
  await eventsCol.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
  return;
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    await eventsCol.doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Esemény törlés hiba:', err);
    res.status(500).json({ message: 'Delete failed', error: (err as any).message });
  }
};
