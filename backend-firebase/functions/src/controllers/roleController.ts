import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../firebase';
import { Role } from '../types';

const rolesCol = db.collection('roles');

export const listRoles = async (_req: Request, res: Response): Promise<void> => {
  const snap = await rolesCol.get();
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Role) }));
  res.json(items);
  return;
};

export const getRole = async (req: Request, res: Response): Promise<void> => {
  const doc = await rolesCol.doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Role not found');
    return;
  }
  res.json({ id: doc.id, ...(doc.data() as Role) });
  return;
};

export const createRole = async (req: Request, res: Response): Promise<void> => {
  const data = req.body as Role;
  const ref  = await rolesCol.add(data);
  res.status(201).json({ id: ref.id });
  return;
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<Role> = req.body;
  await rolesCol.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
  return;
};

export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    await rolesCol.doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Szerepkör törlés hiba:', err);
    res.status(500).json({ message: 'Delete failed', error: (err as any).message });
  }
};
