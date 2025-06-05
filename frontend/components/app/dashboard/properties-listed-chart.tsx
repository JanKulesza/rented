"use client";
import CustomAreaChart from "@/components/elements/custom-area-chart";
import {
  agencyContext,
  Property,
} from "@/components/providers/agency-provider";
import { format, isSameMonth, subMonths } from "date-fns";
import { useContext } from "react";

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
      name: format(dt, "MMM"),
      value: count,
    };
  });

  return <CustomAreaChart data={data} />;
};

export default PropertiesListedChart;
