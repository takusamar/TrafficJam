// import  collectInformation  from "../src/trafficJam";
const collectInformation = require("../src/trafficJam");

async function test() {
  const result = await collectInformation();
}

test();
