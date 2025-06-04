import DataPieCharts from "@/components/app/dashboard/data-pie-charts";
import PropertiesListedChart from "@/components/app/dashboard/properties-listed-chart";
import SRPerType from "@/components/app/dashboard/sr-per-type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InfoCards from "@/components/app/dashboard/info-cards";

import PropertyCarousel from "@/components/app/dashboard/property-carousel";
import LatestSales from "@/components/app/dashboard/latest-sales";
import TopAgents from "@/components/app/dashboard/top-agents";

const AgencyDashboard = ({ params }: { params: { agencyId: string } }) => {
  const { agencyId } = params;

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
      <section className="grid lg:grid-cols-3 gap-2 lg:gap-8">
        <div className="border border-sidebar-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-semibold text-xl mb-2">Top Agents</h6>
            <Button variant="outline" asChild>
              <Link href={`${agencyId}/agents`}>View all</Link>
            </Button>
          </div>
          <TopAgents />
        </div>
        <InfoCards />
        <div className="border border-sidebar-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-semibold text-xl mb-2">Latest sales</h6>
            <Button variant="outline" asChild>
              <Link href={`${agencyId}/sales`}>View all</Link>
            </Button>
          </div>
          <LatestSales />
        </div>
      </section>
      <section className="border border-sidebar-border rounded-xl p-6">
        <PropertyCarousel />
      </section>
    </>
  );
};

export default AgencyDashboard;
