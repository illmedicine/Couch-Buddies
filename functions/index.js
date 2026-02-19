const functions = require('firebase-functions');
const admin = require('firebase-admin');
const storage = admin.storage();

admin.initializeApp();

// Cloud Function to generate a signed URL for file upload
exports.getUploadSignedUrl = functions.https.onCall(async (data, context) => {
  try {
    // Verify user is authenticated
    if (!context.auth) {
      throw new Error('User must be authenticated');
    }

    const { filename, contentType } = data;

    if (!filename || !contentType) {
      throw new Error('filename and contentType are required');
    }

    const bucket = storage.bucket();
    const file = bucket.file(`profiles/${filename}`);

    // Generate signed URL valid for 1 hour
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
      contentType: contentType,
    });

    return { signedUrl: url };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Cloud Function to get download URL for a profile file
exports.getDownloadUrl = functions.https.onCall(async (data, context) => {
  try {
    const { filename } = data;

    if (!filename) {
      throw new Error('filename is required');
    }

    const bucket = storage.bucket();
    const file = bucket.file(`profiles/${filename}`);

    // Generate signed download URL valid for 7 days
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { downloadUrl: url };
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
