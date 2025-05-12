import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="bg-[url(../public/framer.jpg)] bg-cover bg-center bg-fixed h-[90vh] mx-auto mb-30 overflow-hidden">
        <div className="flex flex-col justify-center gap-8 from-zinc-900/20 to-zinc-900/70 bg-gradient-to-b  w-full h-full p-6 md:p-20">
          <h2 className="text-white text-2xl lg:text-5xl xl:text-7xl font-bold uppercase xl:w-1/2">
            Find your perfect home today
          </h2>
          <p className="text-white xl:w-1/2 lg:text-lg xl:text-xl">
            We provide tailored real estate solutions, guiding you through every
            step with personalized experiences that meet your unique needs and
            aspirations.
          </p>
          <Button className="bg-card text-card-foreground rounded-4xl max-sm:w-full w-64 h-11">
            Explore properties
          </Button>
        </div>
      </div>
    </div>
  );
}
