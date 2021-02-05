import { Box, TextField, Typography } from "@material-ui/core";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { TrafficsContext } from "../contexts/Traffics";
import { TrafficChart } from "../molecules/TrafficChart";

export const Home: React.FC = () => {
  const { fetchByDate } = useContext(TrafficsContext);
  const [trafficRecords, setTrafficRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (selectedDate) {
        const newRecords = await fetchByDate(dayjs(selectedDate));
        if (!unmounted) {
          setTrafficRecords(newRecords);
        }
      }
    };
    func();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
    // eslint-disable-next-line
  }, [selectedDate]);

  return (
    <Box>
      <Box m={2} display="flex">
        <Typography variant="body1">日付</Typography>
        <Box ml={1} />
        <TextField
          id="date"
          type="date"
          defaultValue={selectedDate}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
        />
      </Box>
      {trafficRecords && <TrafficChart trafficRecords={trafficRecords} />}
    </Box>
  );
};
