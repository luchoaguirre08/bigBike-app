import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

const app = initializeApp(environment.firebase);
const db = getFirestore(app);
const auth = getAuth(app);
console.log('✅ Firebase App Initialized:', app.name); // 👈
export { db, auth };
