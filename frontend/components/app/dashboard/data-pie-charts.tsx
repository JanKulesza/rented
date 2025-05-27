"use client";
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

  const propertiesData = [
    {
      title: "Total properties",
      data: agency.properties.length,
      chart: [
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
        agency.properties.length === 0 && {
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
        agency.properties.length > 0
          ? {
              name: "Rest",
              value: agency.properties.length - propertiesForRent || 1,
              fill: "var(--accent)",
            }
          : {
              name: "Empty",
              value: 1,
              fill: "var(--accent)",
            },
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
        agency.properties.length > 0
          ? {
              name: "Rest",
              value: agency.properties.length - propertiesForSale || 1,
              fill: "var(--accent)",
            }
          : {
              name: "Empty",
              value: 1,
              fill: "var(--accent)",
            },
      ],
    },
    {
      title: "Pending",
      data: pendingProperties,
      chart: [
        { name: "Pending", value: pendingProperties, fill: "#e1e374" },
        agency.properties.length > 0
          ? {
              name: "Listed",
              value: agency.properties.length - pendingProperties || 1,
              fill: "var(--accent)",
            }
          : {
              name: "Empty",
              value: 1,
              fill: "var(--accent)",
            },
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
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                  data={data.chart}
                  innerRadius={10}
                  outerRadius={40}
                  stroke="var(--accent)"
                  cx="50%"
                  cy="50%"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </>
  );
};

export default DataPieCharts;
