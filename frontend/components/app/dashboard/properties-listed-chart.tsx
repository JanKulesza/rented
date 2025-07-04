"use client";
import CustomLineChart from "@/components/elements/charts/custom-line-chart";
import {
  agencyContext,
  Property,
} from "@/components/providers/agency-provider";
import { format, isSameMonth, subMonths } from "date-fns";
import { useContext } from "react";

const chartConfig = {
  listings: {
    label: "Listings",
    color: "var(--primary)",
  },
};

const PropertiesListedChart = () => {
  const {
    agency: { properties },
  } = useContext(agencyContext);

  const NUM_MONTHS = 11;
  const now = new Date();

  const windowDates = Array.from({ length: NUM_MONTHS }).map((_, i) =>
    subMonths(now, NUM_MONTHS - 1 - i)
  );

  const data = windowDates.map((dt) => {
    const count = properties.filter((p) =>
      isSameMonth(new Date((p as Property).createdAt), dt)
    ).length;

    return {
      month: format(dt, "MMM"),
      listings: count,
    };
  });

  return (
    <CustomLineChart data={data} chartConfig={chartConfig} dataKey="month" />
  );
};

export default PropertiesListedChart;
