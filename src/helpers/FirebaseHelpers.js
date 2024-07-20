// firebaseHelpers.js
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { doc, setDoc } = require('firebase/firestore');
const { storage, firestore } = require('../config/FirebaseConfig'); 
// Import storage and firestore from firebase.js
const uploadFile = async (file, userId) => {
    try {
        const fileRef = ref(storage, `images/${userId}/${file.originalname}`);
        await uploadBytes(fileRef, file.buffer);
        const fileUrl = await getDownloadURL(fileRef);

        // Save file info in Firestore
        await setDoc(doc(firestore, 'images', userId), {
            name: file.originalname,
            url: fileUrl,
        }, { merge: true });

        return { success: true, fileUrl };
    } catch (error) {
        console.error('Error uploading file:', error);
        return { success: false, message: error.message };
    }
};

module.exports = { uploadFile };
