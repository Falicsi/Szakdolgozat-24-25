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
  const now = new Date();
  const ref  = await usersCol.add({
    ...data,
    createdAt: now,
    updatedAt: now
  });

  // Profil automatikus létrehozása a user ID-val
  await db.collection('profiles').doc(ref.id).set({
    userId: ref.id,
    fullName: data.displayName || '',
    avatarUrl: 'assets/default-avatar.png',
    bio: '',
    createdAt: now,
    updatedAt: now
  });

  res.status(201).json({ id: ref.id });
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const data = req.body as any; // vagy: { [key: string]: any }
  const userId = req.params.id;

  // 1. Jelszó módosítás, ha van
  if (data.password) {
    // Jelszó szabályok ellenőrzése (pl. min. 8 karakter, kisbetű, nagybetű, szám, speciális karakter)
    const pw = data.password;
    const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!pwPattern.test(pw)) {
      res.status(400).json({ message: 'A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert.' });
      return;
    }
    try {
      await admin.auth().updateUser(userId, { password: pw });
    } catch (err) {
      res.status(400).json({ message: 'Jelszó módosítás sikertelen', error: (err as any).message });
      return;
    }
    delete data.password; // TÖRÖLD A JELSZÓT, NE KERÜLJÖN A FIRESTORE-BA!
  }

  // 2. Firestore user doc frissítése (a többi mező)
  await usersCol.doc(userId).set(data, { merge: true });
  res.json({ id: userId });
  return;
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await usersCol.doc(req.params.id).delete();
    // Profil törlése is
    await db.collection('profiles').doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Felhasználó törlés hiba:', err);
    res.status(500).json({ message: 'Delete failed', error: (err as any).message });
  }
};
