// functions/src/controllers/eventController.ts
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { Event } from '../types';

const db = admin.firestore();
const col = db.collection('events');

export const listEvents = async (_req: Request, res: Response) => {
  const snap = await col.get();
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Event) }));
  res.json(items);
};

export const getEvent = async (req: Request, res: Response) => {
  const doc = await col.doc(req.params.id).get();
  if (!doc.exists) return res.status(404).send('Event not found');
  res.json({ id: doc.id, ...(doc.data() as Event) });
};

export const createEvent = async (req: Request, res: Response) => {
  const data = req.body as Omit<Event, 'createdAt' | 'updatedAt'>;
  const now  = admin.firestore.FieldValue.serverTimestamp();
  const ref  = await col.add({ ...data, createdAt: now, updatedAt: now });
  res.status(201).json({ id: ref.id });
};

export const updateEvent = async (req: Request, res: Response) => {
  const data: Partial<Event> = req.body;
  data.updatedAt = admin.firestore.FieldValue.serverTimestamp() as any;
  await col.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
};

export const deleteEvent = async (req: Request, res: Response) => {
  await col.doc(req.params.id).delete();
  res.status(204).end();
};
