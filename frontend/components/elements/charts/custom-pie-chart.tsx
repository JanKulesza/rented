import { ResponsiveContainer, Pie, Tooltip, PieChart } from "recharts";

interface Props {
  data: { name: string; value: number; fill: string }[];
}

const CustomPieChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={90}
          endAngle={450}
          data={data}
          innerRadius={10}
          outerRadius={40}
          stroke="var(--accent)"
          cx="50%"
          cy="50%"
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
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
