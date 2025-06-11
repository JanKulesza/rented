import { ListingTypes, Property } from "@/components/providers/agency-provider";
import { formatAddress } from "@/lib/utils";
import { Dot, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  property: Property;
}

const PropertyCard = ({ property }: Props) => {
  return (
    <Link
      href={`listings/${property._id}`}
      className="flex flex-col h-96 border border-sidebar-border rounded-xl overflow-hidden  hover:bg-sidebar/80 duration-500 transition-all"
    >
      <div className="relative w-full h-3/5">
        <Image
          src={property.image.url}
          alt={property.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-2 bg-black/70 text-white px-3 py-1 rounded-lg">
          For {property.listingType}
        </div>
      </div>
      <div className="h-2/5 p-4 flex flex-col justify-between">
        <div>
          <h5 className="font-semibold text-xl">
            {`$${property.price.toLocaleString()}${
              property.listingType === ListingTypes.RENT ? " /mo" : ""
            }`}
          </h5>
          <span className="flex gap-0.5">
            {property.name} <Dot />
            <span className="text-muted-foreground">
              {property.propertyType}
            </span>
          </span>
        </div>
        <span className="text-muted-foreground  items-center flex gap-1">
          <MapPin /> {formatAddress(property.address)}
        </span>
      </div>
    </Link>
  );
};

export default PropertyCard;
