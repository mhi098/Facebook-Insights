import { addDays, differenceInCalendarDays, format } from "date-fns";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatNumber } from "../utils/numberHandler";

// Custom function to format date
const formatTooltipDate = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const formattedDate = formatTooltipDate(payload[0]?.payload?.date || "");
    return (
      <div
        className="shadow "
        style={{
          backgroundColor: "#fff",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <p className="text-muted fs-12 mb-1 text-center">{formattedDate}</p>
        <div className="d-flex  gap-1 ">
          <span
            className="rounded mt-2 "
            style={{
              backgroundColor: "rgba(140, 217, 255,1)",
              width: "18px",
              height: "4px",
            }}
          ></span>
          <div>
            <p className="fs-14 mb-0 mt-0">Total approximate earnings</p>
            <p className="fs-14 mb-0 mt-0">
              {payload[0]?.value.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const LineGraph = ({ posts, startDate, endDate, type }) => {
  const [pData, setPData] = useState([]);
  const [secondHalfpData, setSecondHalfPData] = useState([]);
  const [firstHalfpData, setFirstHalfPData] = useState([]);
  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    const totalDays = differenceInCalendarDays(endDate, startDate);

    for (let i = 0; i <= totalDays; i++) {
      dates.push(format(addDays(startDate, i), "yyyy-MM-dd"));
    }

    return dates;
  };

  const processEarnings = (startDate, endDate, earnings, type) => {
    // Generate the full range of dates
    const allDates = generateDateRange(startDate, endDate);

    // Create the output object and array
    const dateObjects = [];
    const dateMap = {};

    allDates.forEach((date) => {
      let earning;
      if (type === "total") {
        earning = earnings.find(
          (e) => moment(e.datePublished).format("yyyy-MM-DD") === date
        );
      } else {
        earning = earnings.find(
          (e) =>
            e.type === type &&
            moment(e.datePublished).format("yyyy-MM-DD") === date
        );
      }
      const totalEarning = earning ? earning.totalEarning : 0;

      // Push to array
      dateObjects.push({ date, earning: totalEarning });

      // Add to map
      dateMap[date] = totalEarning;
    });

    return { dateObjects, dateMap };
  };

  useEffect(() => {
    const { dateObjects } = processEarnings(startDate, endDate, posts, type);
    // setPData(dateObjects);
    const midpoint = Math.floor(dateObjects.length / 2);
    const firstHalf = dateObjects.slice(0, midpoint);
    const secondHalf = dateObjects.slice(midpoint - 1);
    setPData(dateObjects);
    setFirstHalfPData(firstHalf);
    setSecondHalfPData(secondHalf);
  }, [posts, startDate, endDate, type]);

  function generateTicks(min, max, count = 5) {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) => Math.round(min + i * step));
  }
  const maxValue = Math.max(...pData.map((d) => d.earning));
  const ticks = generateTicks(0, maxValue, 5);
  return (
    <div style={{ width: "100%", height: 300 }} className="pe-4">
      <ResponsiveContainer>
        <LineChart key={Date.now()} data={pData} className="cursor-pointer">
          <CartesianGrid strokeDasharray="3 0" vertical={false} />

          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              if (!date) return ""; // Return an empty string for empty date values
              const parsedDate = new Date(date);
              return parsedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
            interval={pData.length > 4 ? Math.floor(pData.length / 4) : 0} // Adjust interval for weekly points
            tick={{ fontSize: 14 }}
          />

          <YAxis
            domain={[0, "dataMax"]}
            tick={{ fontSize: 14 }}
            ticks={ticks}
            tickFormatter={formatNumber}
            interval="preserveStartEnd"
          />

          <ReferenceLine stroke="rgba(0, 0, 0, 0.5)" strokeDasharray="3 3" />

          {/* Using the custom tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "rgba(0, 0, 0, 0.3)",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />

          <Line
            dataKey="earning"
            type="linear"
            stroke="rgba(140, 217, 255,1)"
            strokeWidth={2}
            strokeLinejoin="round"
            fill="none"
            strokeLinecap="round"
            dot={false}
            isAnimationActive={true}
            animationDuration={700} // overall animation time (in ms)
            animationEasing="ease-out" // Smooth easing for the animation
            key="line"
            activeDot={{ r: 5.5, fill: "rgba(140, 217, 255,1)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(LineGraph);
