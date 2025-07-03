"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, XAxis, Line, LabelList, LineChart } from "recharts";

interface CustomLineChartProps {
  data: unknown[];
  dataKey: string;
  chartConfig: ChartConfig;
}

const CustomLineChart = ({
  data,
  dataKey,
  chartConfig,
}: CustomLineChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 30,
          bottom: 10,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dataKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        {Object.keys(chartConfig).map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="natural"
            stroke={chartConfig[key].color}
            strokeWidth={2}
            dot={{
              fill: chartConfig[key].color,
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        ))}
      </LineChart>
    </ChartContainer>
  );
};

export default CustomLineChart;
