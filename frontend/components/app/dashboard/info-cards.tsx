"use client";
import {
  agencyContext,
  Property,
} from "@/components/providers/agency-provider";
import {
  isWithinInterval,
  startOfMonth,
  subMonths,
  endOfMonth,
} from "date-fns";
import React, { useContext, useMemo } from "react";

const InfoCards = () => {
  const { agency } = useContext(agencyContext);
  const allProps = agency.properties as Property[];
  const now = useMemo(() => new Date(), []);

  // count props whose createdAt is within a [start, end] interval
  const countInInterval = (start: Date, end: Date) =>
    allProps.filter((p) => isWithinInterval(p.createdAt, { start, end }))
      .length;

  const thisMoStart = startOfMonth(now);
  const lastMoStart = startOfMonth(subMonths(now, 1));
  const twoMoStart = startOfMonth(subMonths(now, 2));
  const lastMoEnd = endOfMonth(subMonths(now, 1));
  const twoMoEnd = endOfMonth(subMonths(now, 2));

  const thisMoCount = countInInterval(thisMoStart, now);
  const lastMoCount = countInInterval(lastMoStart, lastMoEnd);
  const twoMoCount = countInInterval(twoMoStart, twoMoEnd);

  // % change helpers (guard divide-by-zero => 100% if prior was zero)
  const pctChange = (current: number, previous: number) =>
    previous === 0
      ? current > 0
        ? 100
        : 0
      : ((current - previous) / previous) * 100;

  const activity = pctChange(thisMoCount, lastMoCount);
  const prevActivity = pctChange(lastMoCount, twoMoCount);
  const activityDiff = activity - prevActivity;

  const rentedThisMo = allProps.filter(
    (p) =>
      p.isSold &&
      isWithinInterval(p.createdAt, { start: thisMoStart, end: now })
  ).length;
  const rentedLastMo = allProps.filter(
    (p) =>
      p.isSold &&
      isWithinInterval(p.createdAt, { start: lastMoStart, end: lastMoEnd })
  ).length;
  const rentedDiff = pctChange(rentedThisMo, rentedLastMo);

  return (
    <div className="flex lg:flex-col gap-2 lg:gap-8">
      <div className="max-lg:w-1/2 lg:h-1/2 border border-sidebar-border rounded-xl p-6 lg:py-10">
        <h6 className="font-semibold text-xl mb-2">Currently Rented</h6>
        <div className="text-2xl sm:text-4xl">{rentedThisMo}</div>
        <span
          className={`sm:text-xl ${
            rentedDiff >= 0 ? "text-primary" : "text-destructive"
          }`}
        >
          {rentedDiff >= 0 && "+"}
          {rentedDiff.toFixed(1)}%
        </span>
      </div>

      <div className="max-lg:w-1/2 lg:h-1/2 border border-sidebar-border rounded-xl p-6">
        <h6 className="font-semibold text-xl mb-2">Listing Activity</h6>
        <div className="text-2xl sm:text-4xl">{Math.round(activity)}%</div>
        <span
          className={`sm:text-xl ${
            activityDiff >= 0 ? "text-primary" : "text-destructive"
          }`}
        >
          {activityDiff >= 0 && "+"}
          {activityDiff.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default InfoCards;
