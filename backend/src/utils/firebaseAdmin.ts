// src/utils/firebaseAdmin.ts
import admin from 'firebase-admin';
import serviceAccount from '../../firebase-service-account.json';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        // databaseURL: "https://project-id.firebaseio.com",
        // Realtime Data 전용 설정 / Firestore만 쓴다면 생략
    });
}

export default admin;
