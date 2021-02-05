import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {
//     structuredData: true,
//   });
//   response.send("Hello from Firebase! tksTrafficJam");
// });

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const collectInformation = require("../src/trafficJam");
export const doCollectInformation = functions
  .region("asia-northeast2")
  .pubsub.schedule("every 10 minutes")
  .onRun(async (context) => {
    await collectInformation();
  });
