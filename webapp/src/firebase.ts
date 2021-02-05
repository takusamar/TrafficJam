import dayjs from "dayjs";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

export const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export type Timestamp = firebase.firestore.Timestamp;

export const toTimestamp = (value: dayjs.Dayjs) => {
  return firebase.firestore.Timestamp.fromDate(value.toDate());
};

export const toDayjs = (value: Timestamp) => {
  return dayjs(new Date(value.seconds * 1000));
};
