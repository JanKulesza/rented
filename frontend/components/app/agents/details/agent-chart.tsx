import CustomLineChart from "@/components/elements/charts/custom-line-chart";
import { Property } from "@/components/providers/agency-provider";
import { ListingTypes } from "@/entities/listing-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import {
  subMonths,
  format,
  endOfMonth,
  startOfMonth,
  isWithinInterval,
  isBefore,
} from "date-fns";
import { TrendingDown, TrendingUp } from "lucide-react";

const chartConfig = {
  totalListings: {
    label: "Total listings",
    color: "var(--primary)",
  },
  rent: {
    label: "For rent",
    color: "#82ca9d",
  },
  sale: {
    label: "For sale",
    color: "#fe6d8e",
  },
} satisfies ChartConfig;

const AgentChart = ({ properties }: { properties: Property[] }) => {
  const NUM_MONTHS = 6;
  const now = new Date();

  const windowDates = Array.from({ length: NUM_MONTHS }).map((_, i) =>
    subMonths(now, NUM_MONTHS - 1 - i)
  );

  const data = windowDates.map((dt) => {
    const count = properties.filter((p) =>
      isBefore(p.createdAt, endOfMonth(dt))
    ).length;
    const countRent = properties.filter(
      (p) =>
        (p.listingType as ListingTypes) === ListingTypes.RENT &&
        isBefore(p.createdAt, endOfMonth(dt))
    ).length;
    const countSale = properties.filter(
      (p) =>
        p.listingType === ListingTypes.SALE &&
        isBefore(p.createdAt, endOfMonth(dt))
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
    <Card className="w-full sm:w-1/2 lg:w-2/3">
      <CardHeader>
        <CardTitle>Agent&apos;s listings</CardTitle>
        <CardDescription>
          {format(subMonths(now, 5), "MMMM")} - {format(now, "MMMM yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <CustomLineChart
          chartConfig={chartConfig}
          data={data}
          dataKey="month"
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-1 leading-none font-medium">
          Trending
          <span
            className={`${
              +pctChange > 0 ? "text-primary" : "text-destructive"
            } flex gap-1`}
          >
            {+pctChange > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {pctChange.toString()}%
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
