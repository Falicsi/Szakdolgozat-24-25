import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../firebase';
import { Category } from '../types';

const categoriesCol = db.collection('categories');

export const listCategories = async (_req: Request, res: Response): Promise<void> => {
  const snap = await categoriesCol.get();
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Category) }));
  res.json(items);
  return;
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  const doc = await categoriesCol.doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Category not found');
    return;
  }
  res.json({ id: doc.id, ...(doc.data() as Category) });
  return;
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const data = req.body as Omit<Category, 'createdAt' | 'updatedAt'>;
  const now  = admin.firestore.FieldValue.serverTimestamp();
  const ref  = await categoriesCol.add({ ...data, createdAt: now, updatedAt: now });
  res.status(201).json({ id: ref.id });
  return;
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const data: Partial<Category> = req.body;
  data.updatedAt = admin.firestore.FieldValue.serverTimestamp() as any;
  await categoriesCol.doc(req.params.id).set(data, { merge: true });
  res.json({ id: req.params.id });
  return;
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  await categoriesCol.doc(req.params.id).delete();
  res.status(204).end();
  return;
};
