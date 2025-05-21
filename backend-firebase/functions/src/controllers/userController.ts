import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../firebase';
import { User } from '../types';
import { getFirestore } from 'firebase-admin/firestore';

const usersCol = db.collection('users');

export async function listUsers(req: Request, res: Response) {
  try {
    const snap = await getFirestore().collection('users').get();
    console.log('Firestore users docs:', snap.docs.map(d => d.data())); // <-- EZT ADD HOZZÁ
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(users);
  } catch (err) {
    console.error('Hiba a userek lekérdezésekor:', err); // <-- EZT IS
    res.status(500).json({ message: 'Hiba a userek lekérdezésekor', error: err });
  }
}

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
  const data = req.body as User;
  const ref  = await usersCol.add(data);
  res.status(201).json({ id: ref.id });
  return;
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<User> = req.body;
  await usersCol.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
  return;
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await usersCol.doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Felhasználó törlés hiba:', err);
    res.status(500).json({ message: 'Delete failed', error: (err as any).message });
  }
};
