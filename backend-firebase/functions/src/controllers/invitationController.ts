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
  const data = req.body as Invitation;
  const ref  = await invitationsCol.add(data);
  res.status(201).json({ id: ref.id });
  return;
};

export const updateInvitation = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<Invitation> = req.body;
  await invitationsCol.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
};

export const deleteInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    await invitationsCol.doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Meghívó törlés hiba:', err);
    res.status(500).json({ message: 'Delete failed', error: (err as any).message });
  }
};

export const getInvitationsByUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  const snap = await invitationsCol.where('userId', '==', userId).get();
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Invitation) }));
  res.json(items);
};
