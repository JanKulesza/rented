import React from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

const CustomAreaChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: -19 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a7ce4" stopOpacity={1} />
            <stop offset="75%" stopColor="#5a7ce4" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#5a7ce4" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="var(--accent)" />

        <XAxis
          dataKey="name"
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          padding={{ left: 10, right: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          dataKey="value"
          domain={["dataMin", (dataMax: number) => Math.ceil(dataMax * 1.1)]}
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

        <Area
          type="monotone"
          dataKey="value"
          stroke="#5a7ce4"
          strokeWidth={4}
          fill="url(#colorUv)"
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;
