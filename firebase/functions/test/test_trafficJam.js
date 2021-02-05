var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const collectInformation = require("../src/trafficJam");

async function test() {
  const result = await collectInformation();
}

test();
