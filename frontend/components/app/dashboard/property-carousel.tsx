"use client";
import {
  agencyContext,
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
import React, { useContext, useState } from "react";
import PropertyCard from "../listings/property-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PropertyCarousel = () => {
  const {
    agency: { properties },
  } = useContext(agencyContext);
  const [filteredProp, setFilteredProp] = useState(properties as Property[]);
  const [propSorting, setPropSorting] = useState<"popular" | "newest">(
    "popular"
  );

  const handleFilterByType = (value: PropertyTypes) => {
    setFilteredProp(
      (properties as Property[]).filter((p) => p.propertyType === value)
    );
  };
  return (
    <>
      <div className="flex justify-between mb-5 items-center">
        <h6 className="font-semibold text-xl mb-2">Listings</h6>
        <div className="flex gap-2">
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
        <Carousel
          opts={{
            align: "start",
          }}
        >
          <CarouselContent>
            {sort(filteredProp)
              .desc((p) => (propSorting === "popular" ? p.rating : p.createdAt))
              .slice(0, 19)
              .map((p) => (
                <CarouselItem
                  className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  key={p._id}
                >
                  <PropertyCard property={p} />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
};

export default PropertyCarousel;
