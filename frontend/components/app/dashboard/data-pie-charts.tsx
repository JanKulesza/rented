"use client";
import CustomPieChart from "@/components/elements/custom-pie-chart";
import {
  agencyContext,
  ListingTypes,
  Property,
} from "@/components/providers/agency-provider";
import { useContext } from "react";
import { ResponsiveContainer, Pie, Tooltip, PieChart } from "recharts";

const DataPieCharts = () => {
  const { agency } = useContext(agencyContext);

  const propertiesForSale = agency.properties.filter(
    (p) => (p as Property).listingType === ListingTypes.SALE
  ).length;
  const propertiesForRent = agency.properties.filter(
    (p) => (p as Property).listingType === ListingTypes.RENT
  ).length;
  const pendingProperties = agency.properties.filter(
    (p) => !(p as Property).agent
  ).length;

  const checkIfProps = (value: number) =>
    agency.properties.length > 0
      ? {
          name: "Rest",
          value: agency.properties.length - value || 1,
          fill: "var(--accent)",
        }
      : {
          name: "Empty",
          value: 1,
          fill: "var(--accent)",
        };

  const propertiesData = [
    {
      title: "Total properties",
      data: agency.properties.length,
      chart:
        agency.properties.length === 0
          ? [
              {
                name: "Properties for rent",
                value: propertiesForRent,
                fill: "#5a7ce4",
              },
              {
                name: "Properties for sale",
                value: propertiesForSale,
                fill: "#82ca9d",
              },
              { name: "Pending", value: pendingProperties, fill: "#e1e374" },
            ]
          : [
              {
                name: "No properties",
                value: 1,
                fill: "var(--accent)",
              },
            ],
    },
    {
      title: "For Rent",
      data: propertiesForRent,
      chart: [
        {
          name: "For Rent",
          value: propertiesForRent,
          fill: "#5a7ce4",
        },
        checkIfProps(propertiesForRent),
      ],
    },
    {
      title: "For Sale",
      data: propertiesForSale,
      chart: [
        {
          name: "For Sale",
          value: propertiesForSale,
          fill: "#82ca9d",
        },
        checkIfProps(propertiesForSale),
      ],
    },
    {
      title: "Pending",
      data: pendingProperties,
      chart: [
        { name: "Pending", value: pendingProperties, fill: "#e1e374" },
        checkIfProps(pendingProperties),
      ],
    },
  ];

  return (
    <>
      {propertiesData.map((data) => (
        <div
          key={data.title}
          className="flex h-36 items-center border border-sidebar-border rounded-xl px-8 p-4"
        >
          <div className="space-y-1 w-1/2">
            <p className="lg:text-lg">{data.title}</p>
            <p className="text-xl lg:text-2xl font-semibold">{data.data}</p>
          </div>
          <div className="w-1/2 h-full">
            <CustomPieChart data={data.chart} />
          </div>
        </div>
      ))}
    </>
  );
};

export default DataPieCharts;
