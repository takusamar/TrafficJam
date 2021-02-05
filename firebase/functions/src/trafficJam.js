const axios = require('axios');
const dayjs = require('dayjs');

require('dotenv').config();

// export async function collectInformation() {
module.exports = async function collectInformation() {
  console.log("collect information");

  const interChangeEast = { lat: 26.336897, lng: 127.792972 };  // 沖縄南IC（東）
  const interChangeWest = { lat: 26.335414, lng: 127.787199 };  // 沖縄南IC（西）
  const gymnasium = { lat: 26.333880, lng: 127.787351 };  // 沖縄市体育館

  (async () => {
    for await (srcPosition of [
      interChangeEast,
      interChangeWest,
    ]) {
      const result = await getJam(srcPosition, gymnasium);
      console.log(result);
      if (result) {
      }
    }
  })();

  return;
}

const getJam = async (src, dst) => {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const googleApiUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

  console.log(API_KEY);
  // デフォルト：自動車、現在時刻、最短旅行時間
  const uri = googleApiUrl + "?units=metric" +
    "&origins=" + src.lat + "," + src.lng +
    "&destinations=" + dst.lat + "," + src.lng +
    "&key=" + API_KEY;

  const now = dayjs();
  console.log(`src : ${src.lat} ${src.lng}  dst: ${dst.lat} ${dst.lng} now:${now}`);

  try {
    const response = await axios.get(uri);
    const result = response.data;
    console.log(`${JSON.stringify(result, null, 2)}`)
    if ('rows' in result) {
      for (row of result.rows) {
        for (element of row.elements) {
          return {
            timestamp: now,
            src: src,
            dst: dst,
            distance: element.distance.value, // meters
            duration: element.duration.value, // seconds
          };
        }
      }
    }
  } catch (error) {
    console.log(error.response.body);
  }
  return null;
}
