import { Timestamp } from "../firebase";

export type TLatLng = {
  lat: number;
  lng: number;
};
export type TTraffic = {
  name: string;
  src: TLatLng;
  dst: TLatLng;
  distance: number;
  duration: number;
  kph: number;
  timestamp: Timestamp;
};

export type TTrafficRecord = {
  id: string;
  datetime: Timestamp;
  rows: TTraffic[];
};
