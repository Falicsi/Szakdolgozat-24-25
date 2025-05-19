import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../firebase';
import { Invitation } from '../types';

const invitationsCol = db.collection('invitations');

export const listInvitations = async (_req: Request, res: Response): Promise<void> => {
  const snap = await invitationsCol.get();
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Invitation) }));
  res.json(items);
  return;
};

export const getInvitation = async (req: Request, res: Response): Promise<void> => {
  const doc = await invitationsCol.doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Invitation not found');
    return;
  }
  res.json({ id: doc.id, ...(doc.data() as Invitation) });
  return;
};

export const createInvitation = async (req: Request, res: Response): Promise<void> => {
  const data = req.body as Omit<Invitation, 'createdAt' | 'updatedAt'>;
  const now  = admin.firestore.FieldValue.serverTimestamp();
  const ref  = await invitationsCol.add({ ...data, createdAt: now, updatedAt: now });
  res.status(201).json({ id: ref.id });
  return;
};

export const updateInvitation = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<Invitation> = req.body;
  data.updatedAt = admin.firestore.FieldValue.serverTimestamp() as any;
  await invitationsCol.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
  return;
};

export const deleteInvitation = async (req: Request, res: Response): Promise<void> => {
  await invitationsCol.doc(req.params.id).delete();
  res.status(204).end();
  return;
};
