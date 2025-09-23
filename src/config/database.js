const admin = require('firebase-admin');

let db = null;

const connectDB = async () => {
  try {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }

    // Get Firestore instance
    db = admin.firestore();
    
    // Test connection
    await db.collection('Trails').limit(1).get();
    
    console.log('🔥 Firebase Firestore Connected');
  } catch (error) {
    console.error('❌ Firebase connection error:', error.message);
    process.exit(1);
  }
};

// Get Firestore instance
const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
};

// Get Firebase Admin instance
const getAdmin = () => {
  return admin;
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔌 Firebase connection closed through app termination');
  process.exit(0);
});

module.exports = { connectDB, getDB, getAdmin };
