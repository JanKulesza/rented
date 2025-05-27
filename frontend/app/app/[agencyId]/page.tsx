import DataPieCharts from "@/components/app/dashboard/data-pie-charts";
import PropertiesListedChart from "@/components/app/dashboard/properties-listed-chart";

const AgencyDashboard = () => {
  return (
    <>
      <section className="grid sm:grid-cols-2 xl:grid-cols-4 w-full justify-center sm:justify-between gap-2 lg:gap-8">
        <DataPieCharts />
      </section>
      <section className="flex max-sm:flex-col gap-8 h-[500px]">
        <div className="border border-sidebar-border sm:w-3/4 rounded-xl p-4 md:p-8">
          <h6 className="font-semibold text-2xl mb-5">Properties listed</h6>
          <PropertiesListedChart />
        </div>
      </section>
    </>
  );
};

export default AgencyDashboard;
