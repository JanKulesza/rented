import SearchProperties from "@/components/elements/seach-properties";
import ShowError from "@/components/elements/show-error";

export default function Home() {
  return (
    <>
      <ShowError />
      {/* <div className="bg-[url(../public/skyscraper.jpeg)] w-full bg-cover bg-center bg-fixed h-[90vh] mx-auto mb-30 brightness-50 opacity-50 overflow-hidden">
        <div className="flex flex-col items-center justify-center h-full ">
          <div className="w-36 h-36 brightness-100 bg-white"></div>
        </div>
      </div> */}
      <div className="bg-sidebar border-b border-sidebar-border p-8">
        <div className="flex flex-col items-center justify-center bg-sidebar">
          <h1 className="text-2xl font-bold text-primary">Welcome to Rented</h1>
          <p className="text-secondary-foreground mt-4">
            Your one-stop solution for property management
          </p>
        </div>
        <div className="flex justify-center mt-10">
          <SearchProperties />
        </div>
      </div>
    </>
  );
}
