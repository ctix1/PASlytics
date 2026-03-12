const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.analyzeImage = functions.firestore
  .document("analysis/{analysisId}")
  .onCreate(async (snap, context) => {
    const analysis = snap.data();

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const score = Math.random() * 100;
    const status = "Completed";

    return snap.ref.update({ score, status });
  });
