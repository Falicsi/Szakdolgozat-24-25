import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../firebase';
import { Category } from '../types';
import { FieldValue } from 'firebase-admin/firestore';

const categoriesCol = db.collection('categories');

export const listCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const snap = await categoriesCol.get();
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Category) }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'List failed', error: (err as any).message });
  }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await categoriesCol.doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).send('Category not found');
      return;
    }
    res.json({ id: doc.id, ...(doc.data() as Category) });
  } catch (err) {
    res.status(500).json({ message: 'Get failed', error: (err as any).message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body as Category;
    const ref = await categoriesCol.add(data);
    res.status(201).json({ id: ref.id });
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: (err as any).message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: Partial<Category> = req.body;
    await categoriesCol.doc(req.params.id).set(data, { merge: true });
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: (err as any).message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Kategória törlés indult:', {
      user: (req as any).user,
      id: req.params.id
    });
    await categoriesCol.doc(req.params.id).delete();
    console.log('Kategória törölve:', req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error('Kategória törlés hiba:', err);
    console.error('Törlés jogosultság ellenőrzés:', {
      user: (req as any).user,
      id: req.params.id
    });
    res.status(500).json({ message: 'Delete failed', error: (err as any).message });
  }
};
