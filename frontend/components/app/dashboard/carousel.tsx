"use client";
import PropertyCarousel from "@/components/elements/property-carousel";
import {
  agencyContext,
  Property,
} from "@/components/providers/agency-provider";
import { useContext } from "react";

const ListingsCarousel = () => {
  const {
    agency: { properties },
  } = useContext(agencyContext);
  return <PropertyCarousel properties={properties as Property[]} />;
};

export default ListingsCarousel;
