"use client";
import DataPieCharts from "@/components/app/dashboard/data-pie-charts";
import PropertiesListedChart from "@/components/app/dashboard/properties-listed-chart";
import SRPerType from "@/components/app/dashboard/sr-per-type";

const AgencyDashboard = () => {
  return (
    <>
      <section className="grid sm:grid-cols-2 xl:grid-cols-4 w-full justify-center sm:justify-between gap-2 lg:gap-8">
        <DataPieCharts />
      </section>
      <section className="flex max-lg:flex-col gap-2 lg:gap-8">
        <div className="border border-sidebar-border lg:w-2/3 rounded-xl p-4 sm:p-6 xl:p-8">
          <h6 className="font-semibold text-xl mb-5">Properties listed</h6>
          <div className="w-full h-96 overflow-hidden">
            <PropertiesListedChart />
          </div>
        </div>
        <div className=" border border-sidebar-border lg:w-1/3 rounded-xl p-4 sm:p-6 xl:p-8">
          <h6 className="font-semibold text-xl mb-5">S&R Per Property Type</h6>
          <SRPerType />
        </div>
      </section>
    </>
  );
};

export default AgencyDashboard;
