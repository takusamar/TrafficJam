import React, { useEffect, useState } from "react";
import { TTrafficRecord } from "../models/TTraffic";
import { toDayjs } from "../firebase";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OwnProps {
  trafficRecords: TTrafficRecord[];
}

const lineColors = [
  "red",
  "orange",
  "green",
  "blue",
  "purple",
  "navy",
  "yellow",
];

export const TrafficChart: React.FC<OwnProps> = (props) => {
  const [trafficData, setTrafficData] = useState([]);
  const [places, setPlaces] = useState<Set<string>>();

  useEffect(() => {
    var placeSet = new Set<string>();
    var newData: any = [];
    props.trafficRecords?.forEach((record) => {
      var data = {} as any;
      const datetime = toDayjs(record.datetime);
      data["timestamp"] = datetime.format("HH:mm");
      record.rows.forEach((row) => {
        placeSet.add(row.name);
        data[row.name] = row.kph;
      });
      newData.push(data);
    });
    setPlaces(placeSet);
    setTrafficData(newData);
    // console.log(placeSet);
    // console.log(newData);
    // eslint-disable-next-line
  }, [props.trafficRecords]);

  return (
    <LineChart
      width={800}
      height={600}
      data={trafficData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" tick={{ fontSize: ".7rem" }} />
      <YAxis label="km/h" />
      <Tooltip />
      <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
      {places &&
        Array.from(places).map((place, idx) => (
          <Line
            key={idx}
            dot={false}
            type="monotone"
            dataKey={place}
            stroke={lineColors[idx]}
            // fill={lineColors[idx]}
          />
        ))}
    </LineChart>
  );
};
