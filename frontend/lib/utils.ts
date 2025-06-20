import { AddressType } from "@/components/app/listings/add-property/add-property-schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (str: string) => str[0].toUpperCase() + str?.slice(1);

export const formatAddress = (address: AddressType) => {
  return `${address.address}${address.suite ? ` / ${address.suite}` : ""}, ${
    address.city
  } - ${address.zip}, ${address.state}, ${address.country}`;
};
