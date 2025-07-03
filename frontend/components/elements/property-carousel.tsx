"use client";
import {
  Property,
  PropertyTypes,
} from "@/components/providers/agency-provider";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { sort } from "fast-sort";
import { useState } from "react";
import PropertyCard from "../app/listings/property-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PropertyCarousel = ({ properties }: { properties: Property[] }) => {
  const [filteredProp, setFilteredProp] = useState(properties as Property[]);
  const [propSorting, setPropSorting] = useState<"popular" | "newest">(
    "popular"
  );

  const handleFilterByType = (value: PropertyTypes | "all") => {
    setFilteredProp(
      (properties as Property[]).filter((p) =>
        value === "all" ? true : p.propertyType === value
      )
    );
  };
  return (
    <>
      <div className="flex max-sm:flex-col w-full justify-between mb-10 items-center">
        <h6 className="font-medium text-lg mb-2">Active listings</h6>
        <div className="flex max-sm:flex-col gap-2 max-sm:w-full">
          <Button
            onClick={() => setPropSorting("popular")}
            variant={propSorting === "popular" ? "default" : "secondary"}
          >
            Popular
          </Button>
          <Button
            onClick={() => setPropSorting("newest")}
            variant={propSorting === "newest" ? "default" : "secondary"}
          >
            Newest
          </Button>
          <Select onValueChange={handleFilterByType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"}>All</SelectItem>
              {Object.values(PropertyTypes).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-12">
        {filteredProp.length !== 0 ? (
          <Carousel>
            <CarouselContent>
              {sort(filteredProp)
                .desc((p) =>
                  propSorting === "popular" ? p.rating : p.createdAt
                )
                .slice(0, 19)
                .map((p) => (
                  <CarouselItem
                    className="basis-full md:basis-1/2 lg:basis-1/3"
                    key={p._id}
                  >
                    <PropertyCard property={p} />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-muted-foreground w-full py-36 text-center">
            There are no properties to be shown
          </p>
        )}
      </div>
    </>
  );
};

export default PropertyCarousel;
