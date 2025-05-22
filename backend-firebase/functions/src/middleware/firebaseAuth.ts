import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

export function firebaseAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No or invalid Authorization header' });
    return;
  }
  const idToken = authHeader.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      (req as any).user = decodedToken;
      next();
    })
    .catch(err => {
      res.status(401).json({ message: 'Invalid or expired token', error: err });
    });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (
    user &&
    (
      user.admin === true ||
      (Array.isArray(user.roles) && user.roles.includes('admin'))
    )
  ) {
    next();
    return;
  }
  res.status(403).json({ message: 'Admin privileges required' });
}