const functions = require("firebase-functions");

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const dayjs = require("dayjs");
const tz = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault("Asia/Tokyo");

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {
//     structuredData: true,
//   });

//   // const timestamp = dayjs('2021022214591234', { format: 'MMDDHHmmss', utc: false });
//   const timestamp = dayjs("2021022214591234", "YYYYMMDDHHmmss")
//     .tz("Asia/Tokyo", true)
//     .toDate();
//   console.log(timestamp);

//   response.send(`[timestamp] ${timestamp}`);
// });

const admin = require("firebase-admin");
admin.initializeApp();

const collectInformation = require("../src/trafficJam");
export const doCollectInformation = functions
  .region("asia-northeast2")
  .pubsub.schedule("every 15 minutes")
  .onRun(async (context: any) => {
    await collectInformation();
  });
