// functions/src/controllers/userController.ts
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { User } from '../types';

const db = admin.firestore();
const col = db.collection('users');

export const listUsers = async (_req: Request, res: Response) => {
  const snap = await col.get();
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as User) }));
  res.json(items);
};

export const getUser = async (req: Request, res: Response) => {
  const doc = await col.doc(req.params.id).get();
  if (!doc.exists) return res.status(404).send('User not found');
  res.json({ id: doc.id, ...(doc.data() as User) });
};

export const createUser = async (req: Request, res: Response) => {
  const data = req.body as Omit<User, 'createdAt' | 'updatedAt'>;
  const now  = admin.firestore.FieldValue.serverTimestamp();
  const ref  = await col.add({ ...data, createdAt: now, updatedAt: now });
  res.status(201).json({ id: ref.id });
};

export const updateUser = async (req: Request, res: Response) => {
  const data: Partial<User> = req.body;
  data.updatedAt = admin.firestore.FieldValue.serverTimestamp() as any;
  await col.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
};

export const deleteUser = async (req: Request, res: Response) => {
  await col.doc(req.params.id).delete();
  res.status(204).end();
};
