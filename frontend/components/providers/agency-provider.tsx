"use client";
import { createContext } from "react";

interface Agency {
  _id: string;
  name: string;
  location: string;
  owner: string;
  agents: string[];
  properties: string[];
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
