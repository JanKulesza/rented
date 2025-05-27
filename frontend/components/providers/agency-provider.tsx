"use client";
import { createContext } from "react";
import { User } from "./auth-provider";

export enum PropertyTypes {
  APARTAMENT = "Apartment",
  STUDIO = "Studio",
  HOUSE = "House",
  VILLA = "Villa",
  CONDO = "Condo",
  TOWNHOUSE = "Townhouse",
  COMMERCIAL = "Commercial",
  INDUSTRIAL = "Industrial",
}

export enum ListingTypes {
  SALE = "Sale",
  RENT = "Rent",
  PENDING = "Pending",
}

export interface Property {
  _id: string;
  name: string;
  image: {
    id: string;
    url: string;
  };
  description: string;
  price: number;
  listingType: ListingTypes;
  isSold: boolean;
  rating: number;
  location: string;
  agency: string | Agency;
  agent: string | User;
  propertyType: PropertyTypes;
  createdAt: Date;
  updatedAt: Date;
}

interface Agency {
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
