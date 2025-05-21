import { Request, Response } from 'express';
import { db } from '../firebase';
import { Profile } from '../types';

const profilesCol = db.collection('profiles');

export async function listProfiles(req: Request, res: Response) {
  try {
    const snap = await profilesCol.get();
    const profiles: Profile[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Profile) }));
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Hiba a profilok lekérdezésekor', error: err });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const doc = await profilesCol.doc(req.params.userId).get();
    if (!doc.exists) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    const profile = { id: doc.id, ...(doc.data() as Profile) };
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Hiba a profil lekérdezésekor', error: err });
  }
}

export async function createProfile(req: Request, res: Response) {
  try {
    const data: Profile = req.body;
    const ref = await profilesCol.add(data);
    res.status(201).json({ id: ref.id });
  } catch (err) {
    res.status(400).json({ message: 'Profil létrehozása sikertelen', error: err });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const data: Partial<Profile> = req.body;
    await profilesCol.doc(req.params.userId).set(data, { merge: true });
    res.json({ id: req.params.userId });
  } catch (err) {
    res.status(400).json({ message: 'Profil frissítése sikertelen', error: err });
  }
}

export async function deleteProfile(req: Request, res: Response) {
  try {
    await profilesCol.doc(req.params.userId).delete();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Profil törlése sikertelen', error: err });
  }
}