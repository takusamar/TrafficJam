const firebase = require("firebase-admin");
const firestore = firebase.firestore();

const axios = require("axios");
const dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/timezone"));
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.tz.setDefault("Asia/Tokyo");

require("dotenv").config();

// export async function collectInformation() {
module.exports = async function collectInformation() {
  console.log("collect information");

  const gymnasium = { lat: 26.333880, lng: 127.787351 }; // 沖縄市体育館
  const srcList = [
    {
      name: "IC_East", // 沖縄南IC（東）
      pos: { lat: 26.336897, lng: 127.792972 },
    },
    {
      name: "IC_West", // 沖縄南IC（西）
      pos: { lat: 26.335414, lng: 127.787199 },
    },
    {
      name: "KokutaiSt", // 国体記念道路
      pos: { lat: 26.329507, lng: 127.775845 },
    },
    {
      name: "YamanakaSt", // やまなか通り
      pos: { lat: 26.336175, lng: 127.793147 },
    },
    {
      name: "GroundSt", // グラウンド通り
      pos: { lat: 26.332078, lng: 127.793055 },
    },
  ];

  const promiseList = srcList.map((src) => getTraffic(src.pos, gymnasium).then((traffic) => ({ [src.name]: traffic })));
  const trafficsArray = await Promise.all(promiseList);
  const traffics = trafficsArray.reduce((acc, current) => {
    const key = Object.keys(current)[0];
    acc[key] = current[key];
    return acc;
  }, {});

  const now = dayjs.tz();
  const docId = now.format("YYYYMMDDHHmmss");
  traffics["datetime"] = firebase.firestore.Timestamp.fromDate(now.toDate());
  try {
    await firestore.collection("traffics").doc(docId).set(traffics);
    console.log("docId", docId);
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const getTraffic = async (src, dst) => {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const googleApiUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

  // デフォルト：自動車、現在時刻、最短旅行時間
  const uri = googleApiUrl + "?units=metric" +
    "&mode=driving" +
    "&departure_time=now" +
    "&origins=" + src.lat + "," + src.lng +
    "&destinations=" + dst.lat + "," + src.lng +
    "&key=" + API_KEY;

  const timestamp = firebase.firestore.Timestamp.fromDate(dayjs().toDate());
  try {
    const response = await axios.get(uri);
    const result = response.data;
    // console.log(`${JSON.stringify(result, null, 2)}`)
    if ("rows" in result && result.rows.length > 0) {
      const row = result.rows[0];
      if ("elements" in row && row.elements.length > 0) {
        const element = row.elements[0];
        const distance = element.distance.value; // meters
        const duration = element.duration_in_traffic.value; // seconds
        const kph = Math.round(distance * 36 / duration) / 10; // m/s -> km/h
        return { timestamp, src, dst, distance, duration, kph };
      }
      // for (row of result.rows) {
      //   for (element of row.elements) {
      //     const distance = element.distance.value; // meters
      //     const duration = element.duration_in_traffic.value; // seconds
      //     const kph = Math.round(distance * 36 / duration) / 10; // m/s -> km/h
      //     return { timestamp, src, dst, distance, duration, kph };
      //   }
      // }
    }
  } catch (error) {
    console.log(error.response.body);
  }
  return null;
};
