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
  const data = req.body as Resource;
  const ref  = await resourcesCol.add(data);
  res.status(201).json({ id: ref.id });
  return;
};

export const updateResource = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<Resource> = req.body;
  await resourcesCol.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
  return;
};

export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    await resourcesCol.doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Forrás törlés hiba:', err);
    res.status(500).json({ message: 'Delete failed', error: (err as any).message });
  }
};
