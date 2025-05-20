import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
  if (process.env.FUNCTIONS_EMULATOR === 'true' || process.env.FIRESTORE_EMULATOR_HOST) {
    // Firestore emulátor
    admin.firestore().settings({
      host: 'localhost:8080',
      ssl: false
    });
  }
}

export const db = admin.firestore();
export const firebaseAdmin = admin;
