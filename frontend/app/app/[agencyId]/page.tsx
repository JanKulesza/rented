"use client";
import DataPieCharts from "@/components/app/dashboard/data-pie-charts";
import { agencyContext } from "@/components/providers/agency-provider";
import { useContext } from "react";

const AgencyDashboard = () => {
  const { agency } = useContext(agencyContext);

  return (
    <>
      <h1 className="text-3xl font-semibold mb-0">Dashboard</h1>
      <p className="text-lg text-muted-foreground">{agency.name} CMS</p>
      <section className="grid sm:grid-cols-2 xl:grid-cols-4 w-full justify-center sm:justify-between gap-2 lg:gap-8">
        <DataPieCharts />
      </section>
    </>
  );
};

export default AgencyDashboard;
