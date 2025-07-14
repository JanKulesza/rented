"use client";
import { createContext, useState } from "react";
import { User } from "./auth-provider";
import {
  AddressType,
  LivingAreaType,
} from "../app/listings/add-property/add-property-schema";
import { Amenity } from "@/entities/amenities";
import { ListingTypes } from "@/entities/listing-types";

export enum PropertyTypes {
  APARTMENT = "Apartment",
  STUDIO = "Studio",
  HOUSE = "House",
  VILLA = "Villa",
  CONDO = "Condo",
  TOWNHOUSE = "Townhouse",
  COMMERCIAL = "Commercial",
  INDUSTRIAL = "Industrial",
  WAREHOUSE = "Warehouse",
}

interface PropertyBase {
  _id: string;
  image: {
    id: string;
    url: string;
  };
  name: string;
  description: string;
  price: number;
  isSold: boolean;
  rating: number;
  squareFootage: number;
  address: AddressType;
  livingArea: LivingAreaType | null;
  amenities: Amenity[];
  propertyType: PropertyTypes;
  agency: string | Agency;
  createdAt: string;
  updatedAt: string;
}

export type Property =
  | (PropertyBase & { agent: null; listingType: ListingTypes.PENDING })
  | (PropertyBase & {
      agent: string | User;
      listingType: ListingTypes.SALE | ListingTypes.RENT;
    });

export interface Agency {
  _id: string;
  name: string;
  location: string;
  owner: string | User;
  image: {
    id: string;
    url: string;
  };
  address: AddressType;
  agents: string[] | User[];
  properties: string[] | Property[];
}

interface AgencyContext {
  agency: Agency;
  setAgency: (agency: Agency) => void;
}

export const agencyContext = createContext<AgencyContext>({} as AgencyContext);

const AgencyProvider = ({
  agency: a,
  children,
}: {
  agency: Agency;
  children: React.ReactNode;
}) => {
  const [agency, setAgency] = useState<Agency>(a);
  return (
    <agencyContext.Provider value={{ agency, setAgency }}>
      {children}
    </agencyContext.Provider>
  );
};

export default AgencyProvider;
