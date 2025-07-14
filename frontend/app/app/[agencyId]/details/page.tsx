"use client";
import BackButton from "@/components/elements/back-btn";
import useMap from "@/components/elements/map";
import PropertyCarousel from "@/components/elements/property-carousel";
import {
  agencyContext,
  Property,
} from "@/components/providers/agency-provider";
import { User } from "@/components/providers/auth-provider";
import { Separator } from "@/components/ui/separator";
import { ListingTypes } from "@/entities/listing-types";
import { formatAddress } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

const AgencyDetailsPage = () => {
  const { agency } = useContext(agencyContext);
  const Map = useMap();
  const properties = agency.properties as Property[];
  const owner = agency.owner as User;
  const cities = properties
    .map((property) => property.address.city)
    .filter((city, index, self) => self.indexOf(city) === index);
  const propertiesForRent = properties.filter(
    (property) => property.listingType === ListingTypes.RENT
  ).length;
  const propertiesForSale = properties.filter(
    (property) => property.listingType === ListingTypes.SALE
  ).length;

  return (
    <>
      <BackButton>
        <ChevronLeft /> Details
      </BackButton>
      <div className="space-y-10">
        <div className="flex gap-6 items-center">
          <div className="aspect-square relative w-1/2 max-w-36 ">
            <Image
              fill
              className="rounded-full"
              src={agency.image.url}
              alt={agency.name}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{agency.name}</h1>
            <p className="text-sm text-secondary-foreground">
              Owner: {owner.firstName + " " + owner.lastName}
            </p>
          </div>
        </div>
        <Separator />
        <section className="px-1 space-y-6">
          <h6 className="font-medium text-lg">About</h6>
          <div className="max-sm:text-sm flex gap-x-10 sm:gap-x-20 gap-3 sm:gap-y-6 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold">{cities.length}</h2>
              <p className="text-muted-foreground">Cities</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{agency.agents.length}</h2>
              <p className="text-muted-foreground">Agents</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{propertiesForRent}</h2>
              <p className="text-muted-foreground">Properties for rent</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{propertiesForSale}</h2>
              <p className="text-muted-foreground">Properties for sale</p>
            </div>
          </div>
        </section>
        <Separator />
        <PropertyCarousel properties={properties} />
        <Separator />
        <section>
          <h6 className="font-medium text-lg mb-3">Agency address</h6>
          <p className="text-muted-foreground mb-5">
            {formatAddress(agency.address)}
          </p>
          <Map
            startPosition={[agency.address.lat, agency.address.lon]}
            height="400px"
          />
        </section>
      </div>
    </>
  );
};

export default AgencyDetailsPage;
