import { BedDouble, ChefHat, DoorOpen, ShowerHead } from "lucide-react";

export const livingAreaMapping = {
  beds: {
    label: "Beds",
    info: "Total number of beds available",
    icon: BedDouble,
  },
  bedrooms: {
    label: "Bedrooms",
    info: "Number of private sleeping rooms",
    icon: DoorOpen,
  },
  bathrooms: {
    label: "Bathrooms",
    info: "Number of bathrooms including toilets",
    icon: ShowerHead,
  },
  kitchens: {
    label: "Kitchens",
    info: "Number of kitchens available",
    icon: ChefHat,
  },
};
