import { Box, CircularProgress, TextField, Typography } from "@material-ui/core";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { TrafficChart } from "../molecules/TrafficChart";
import { useTrafficsByDate } from "../hooks/UseFirestore";
import { TTraffic, TTrafficRecord } from "../models/TTraffic";

export const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  return (
    <Box>
      <Box m={2} display="flex">
        <Typography variant="body1">日付</Typography>
        <Box ml={1} />
        <TextField
          id="date"
          type="date"
          defaultValue={selectedDate.format("YYYY-MM-DD")}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            setSelectedDate(dayjs(e.target.value));
          }}
        />
      </Box>
      <Traffics selectedDate={selectedDate} />
    </Box>
  );
};

const Traffics = (props: { selectedDate: Dayjs }) => {
  const { data, status } = useTrafficsByDate(props.selectedDate);
  const [records, setRecords] = useState<TTrafficRecord[]>([]);

  useEffect(() => {
    if (status === "success") {
      const newRecords = data.map((record) => {
        const keys = Object.keys(record).filter((key) => key !== "datetime" && key !== "NO_ID_FIELD");
        const traffics = keys.map((key) => {
          const item = record[key];
          return { ...item, name: key } as TTraffic;
        });
        traffics.sort((a, b) => (a.name < b.name ? -1 : 1));
        return {
          id: record.id,
          datetime: record.datetime,
          rows: traffics,
        } as TTrafficRecord;
      });
      setRecords(newRecords);
    }
  }, [data, status]);

  if (status === "loading") {
    return <CircularProgress />
  }
  if (status === "error") {
    return <Typography>data loading error</Typography>
  }
  return <TrafficChart trafficRecords={records} />
}