import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../serviceAccountKey.json';  // Adjust path as needed

@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        // Check if Firebase is already initialized
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          });
        }
        return admin;
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}