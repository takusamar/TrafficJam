import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { createContext, useCallback } from "react";
import { db } from "../firebase";
import { TTrafficRecord, TTraffic } from "../models/TTraffic";

dayjs.extend(utc);

interface ITrafficsContext {
  fetchByDate: any;
}

const TrafficsContext = createContext<ITrafficsContext>({
  fetchByDate: undefined,
});

const TrafficsProvider = (props: any) => {
  const fetchByDate = useCallback(async (date: Dayjs) => {
    const startDate = date.startOf("date");
    const endDate = startDate.add(1, "day");
    const querySnapshot = await db
      .collection("traffics")
      .where("datetime", ">=", startDate.toDate())
      .where("datetime", "<", endDate.toDate())
      .get();
    const records = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const keys = Object.keys(data).filter((key) => key !== "datetime");
      const traffics = keys.map((key) => {
        const item = data[key];
        return { ...item, name: key } as TTraffic;
      });
      return {
        id: doc.id,
        datetime: data.datetime,
        rows: traffics,
      } as TTrafficRecord;
    });
    // console.log(records);
    return records;
  }, []);

  return (
    <TrafficsContext.Provider value={{ fetchByDate }}>
      {props.children}
    </TrafficsContext.Provider>
  );
};

export { TrafficsContext, TrafficsProvider };
