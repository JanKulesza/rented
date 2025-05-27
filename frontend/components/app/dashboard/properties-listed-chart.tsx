"use client";
import {
  agencyContext,
  Property,
} from "@/components/providers/agency-provider";
import { differenceInCalendarMonths, getMonth } from "date-fns";
import { sort } from "fast-sort";
import { useContext } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PropertiesListedChart = () => {
  const {
    agency: { properties },
  } = useContext(agencyContext);

  const sortedPropertiesFromLast6Mo = sort(
    (properties as Property[]).filter(
      (p) => differenceInCalendarMonths(Date.now(), p.createdAt) >= -5
    )
  ).asc((p) => p.createdAt);

  const data = (() => {
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data: { name: string; value: number }[] = [];
    let currObj: { name: string; value: number } | null;
    let count = 0;
    const currMo = getMonth(sortedPropertiesFromLast6Mo[0].createdAt);

    if (currMo > getMonth(Date.now()) - 6) {
      if (getMonth(Date.now()) - 5 < 0) {
        for (let i = getMonth(Date.now()) - 5; i < 0; i++) {
          data.push({
            name: MONTHS[MONTHS.length + i],
            value: 0,
          });
        }

        for (let i = currMo; i > 0; i--) {
          data.push({
            name: MONTHS[getMonth(Date.now()) - i],
            value: 0,
          });
        }
      } else {
        for (let i = currMo; i >= getMonth(Date.now()) - 5; i--) {
          data.push({
            name: MONTHS[getMonth(Date.now()) - i],
            value: 0,
          });
        }
      }
    }

    sortedPropertiesFromLast6Mo.forEach((p, i) => {
      currObj = { name: MONTHS[currMo], value: ++count };

      if (
        currObj.name &&
        (MONTHS[currMo] !==
          MONTHS[getMonth(sortedPropertiesFromLast6Mo[i + 1]?.createdAt)] ||
          !sortedPropertiesFromLast6Mo[i + 1])
      ) {
        data.push(currObj);
        currObj = null;
        count = 0;
      }
    });

    return data;
  })();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 0, left: -18, bottom: 50 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a7ce4" stopOpacity={0.6} />
            <stop offset="75%" stopColor="#5a7ce4" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#5a7ce4" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="var(--accent)" />

        <XAxis
          dataKey="name"
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          dataKey="value"
          domain={["dataMin", "dataMax"]}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "var(--sidebar)",
            border: "1px solid darkgrey",
            borderRadius: "1rem",
          }}
          itemStyle={{ color: "var(--sidebar-foreground" }}
          cursor={{ stroke: "#555", strokeWidth: 1 }}
        />

        {/* smooth curve, animated stroke + gradient fill */}
        <Area
          type="monotone"
          dataKey="value"
          stroke="#5a7ce4"
          strokeWidth={2}
          fill="url(#colorUv)"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PropertiesListedChart;
