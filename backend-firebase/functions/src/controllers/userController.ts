import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../firebase';
import { User } from '../types';

const usersCol = db.collection('users');

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  const snap = await usersCol.get();
  const users = snap.docs.map(d => ({ id: d.id, ...(d.data() as User) }));
  res.json(users);
  return;
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const doc = await usersCol.doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('User not found');
    return;
  }
  res.json({ id: doc.id, ...(doc.data() as User) });
  return;
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const data = req.body as Omit<User, 'createdAt' | 'updatedAt'>;
  const now  = admin.firestore.FieldValue.serverTimestamp();
  const ref  = await usersCol.add({ ...data, createdAt: now, updatedAt: now });
  res.status(201).json({ id: ref.id });
  return;
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<User> = req.body;
  data.updatedAt = admin.firestore.FieldValue.serverTimestamp() as any;
  await usersCol.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
  return;
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  await usersCol.doc(req.params.id).delete();
  res.status(204).end();
  return;
};
