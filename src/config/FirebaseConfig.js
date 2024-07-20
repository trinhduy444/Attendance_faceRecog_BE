// firebase.js
'use strict';

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

module.exports = { app, storage, firestore };

// const uploadProcessData = async (dataToUpload) => {
//     try {
//         const document = doc(firestoreDb, 'attendance', '5zCNcqY4mMSgFhuordvn');
//         await setDoc(document, dataToUpload, { merge: true });
//         return { success: true, message: 'Document updated successfully' };
//     } catch (err) {
//         console.error(err);
//         return { success: false, message: err.message };
//     }
// };

