import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

export const toTimestamp = (value: dayjs.Dayjs) => {
  return Timestamp.fromDate(value.toDate());
};

export const toDayjs = (value: Timestamp) => {
  return dayjs(new Date(value.seconds * 1000));
};
