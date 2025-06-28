"use client";
import { ListingTypes, Property } from "@/components/providers/agency-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  subMonths,
  isSameMonth,
  format,
  endOfMonth,
  startOfMonth,
  isWithinInterval,
} from "date-fns";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, XAxis, Line, LabelList, LineChart } from "recharts";

const chartConfig = {
  totalListings: {
    label: "Total listings",
  },
  rent: {
    label: "For rent",
  },
  sale: {
    label: "For sale",
  },
} satisfies ChartConfig;

const AgentChart = ({ properties }: { properties: Property[] }) => {
  const NUM_MONTHS = 6;
  const now = new Date();

  const windowDates = Array.from({ length: NUM_MONTHS }).map((_, i) =>
    subMonths(now, NUM_MONTHS - 1 - i)
  );

  const data = windowDates.map((dt) => {
    const inWindow = properties.filter((p) =>
      isSameMonth(new Date((p as Property).createdAt), dt)
    );

    const count = inWindow.length;
    const countRent = inWindow.filter(
      (p) => p.listingType === ListingTypes.RENT
    ).length;
    const countSale = inWindow.filter(
      (p) => p.listingType === ListingTypes.SALE
    ).length;

    return {
      month: format(dt, "MMMM"),
      totalListings: count,
      rent: countRent,
      sale: countSale,
    };
  });

  const countInInterval = (start: Date, end: Date) =>
    properties.filter((p) => isWithinInterval(p.createdAt, { start, end }))
      .length;

  const thisMoStart = startOfMonth(now);
  const lastMoStart = startOfMonth(subMonths(now, 1));
  const lastMoEnd = endOfMonth(subMonths(now, 1));
  const current = countInInterval(thisMoStart, now);
  const previous = countInInterval(lastMoStart, lastMoEnd);
  const pctChange = (
    previous === 0
      ? current > 0
        ? 100
        : 0
      : ((current - previous) / previous) * 100
  ).toFixed();

  return (
    <Card className="w-2/3">
      <CardHeader>
        <CardTitle>Agent&apos;s listings</CardTitle>
        <CardDescription>
          {format(subMonths(now, 5), "MMMM")} - {format(now, "MMMM yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="totalListings"
              type="natural"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{
                fill: "var(--primary)",
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
            <Line
              dataKey="rent"
              type="natural"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{
                fill: "#82ca9d",
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
            <Line
              dataKey="sale"
              type="natural"
              stroke="#fe6d8e"
              strokeWidth={2}
              dot={{
                fill: "#fe6d8e",
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
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-1 leading-none font-medium">
          Trending up by
          <span className="text-primary flex gap-1">
            <TrendingUp className="h-4 w-4" /> {pctChange.toString()}%
          </span>
          this month
        </div>
        <div className="text-muted-foreground leading-none">
          Showing listings for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgentChart;
