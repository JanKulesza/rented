"use client";
import { agencyContext } from "@/components/providers/agency-provider";
import React, { useContext } from "react";

const AgencyDashboard = () => {
  const { agency } = useContext(agencyContext);
  return <div>AgencyDashboard {agency._id}</div>;
};

export default AgencyDashboard;
