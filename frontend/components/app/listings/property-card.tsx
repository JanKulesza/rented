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
      className="flex flex-col min-h-96 rounded-xl overflow-hidden hover:bg-sidebar/80 duration-500 transition-all"
    >
      <div className="relative w-full h-72 max-w-80">
        <Image
          src={property.image.url}
          alt={property.propertyType}
          fill
          className="object-cover rounded-3xl"
        />
        <div className="absolute top-3 left-2 bg-white/90 text-black px-3 py-1 rounded-3xl">
          {property.listingType}
        </div>
      </div>
      <div className="p-2 flex flex-col justify-between">
        <div>
          <span className="flex flex-col">
            {property.propertyType + " in: " + property.address.city}
            <span className="text-muted-foreground text-sm">
              {`$${property.price.toLocaleString()}${
                property.listingType === ListingTypes.RENT ? " /month" : ""
              }`}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
