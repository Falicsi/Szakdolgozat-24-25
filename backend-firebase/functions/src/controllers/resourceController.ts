import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../firebase';
import { Resource } from '../types';

const resourcesCol = db.collection('resources');

export const listResources = async (_req: Request, res: Response): Promise<void> => {
  const snap = await resourcesCol.get();
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Resource) }));
  res.json(items);
  return;
};

export const getResource = async (req: Request, res: Response): Promise<void> => {
  const doc = await resourcesCol.doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Resource not found');
    return;
  }
  res.json({ id: doc.id, ...(doc.data() as Resource) });
  return;
};

export const createResource = async (req: Request, res: Response): Promise<void> => {
  const data = req.body as Omit<Resource, 'createdAt' | 'updatedAt'>;
  const now  = admin.firestore.FieldValue.serverTimestamp();
  const ref  = await resourcesCol.add({ ...data, createdAt: now, updatedAt: now });
  res.status(201).json({ id: ref.id });
  return;
};

export const updateResource = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<Resource> = req.body;
  data.updatedAt = admin.firestore.FieldValue.serverTimestamp() as any;
  await resourcesCol.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
  return;
};

export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  await resourcesCol.doc(req.params.id).delete();
  res.status(204).end();
  return;
};
