"use client";
import { createContext } from "react";
import { User } from "./auth-provider";
import {
  AddressType,
  LivingAreaType,
} from "../app/listings/add-property/add-property-schema";
import { Amenity } from "@/entities/amenities";

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

export enum ListingTypes {
  SALE = "Sale",
  RENT = "Rent",
  PENDING = "Pending",
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
  owner: string;
  agents: string[] | User[];
  properties: string[] | Property[];
}

interface AgencyContext {
  agency: Agency;
}

export const agencyContext = createContext<AgencyContext>({} as AgencyContext);

const AgencyProvider = ({
  agency,
  children,
}: {
  agency: Agency;
  children: React.ReactNode;
}) => {
  return (
    <agencyContext.Provider value={{ agency }}>
      {children}
    </agencyContext.Provider>
  );
};

export default AgencyProvider;
