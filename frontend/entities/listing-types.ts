import { CalendarSync, HandCoins, SquarePen } from "lucide-react";

export enum ListingTypes {
  SALE = "Sale",
  RENT = "Rent",
  PENDING = "Pending",
}

export const listingTypesMapping = [
  {
    type: ListingTypes.RENT,
    icon: CalendarSync,
    info: "Create a rental listing to showcase the property’s features, set the monthly rate and lease terms, and attract qualified tenants.",
  },
  {
    type: ListingTypes.SALE,
    icon: HandCoins,
    info: "Prepare a sale listing that highlights key amenities, establishes the asking price, and provides prospective buyers with all necessary details.",
  },
  {
    type: ListingTypes.PENDING,
    icon: SquarePen,
    info: "Draft a pending listing—no agent assigned yet and not live—where you can gather photos, descriptions and pricing before publishing.",
  },
];
