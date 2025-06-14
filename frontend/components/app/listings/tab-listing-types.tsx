import Tile from "@/components/elements/tile";
import { ListingTypes } from "@/components/providers/agency-provider";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TabsContent } from "@/components/ui/tabs";
import { CalendarSync, HandCoins, SquarePen } from "lucide-react";
import { TabEnum } from "./add-property";
import { useFormContext } from "react-hook-form";

const TabListingTypes = () => {
  const form = useFormContext();
  const listingTypes = [
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
  return (
    <TabsContent value={TabEnum.ListingType} className="flex flex-col">
      <SheetHeader className="mb-3 px-0">
        <SheetTitle className="text-2xl">Choose listing type</SheetTitle>
        <SheetDescription>
          How would you like to list your property?
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col gap-4">
          {listingTypes.map(({ type, icon, info }) => (
            <Tile
              key={type}
              icon={icon}
              label={type}
              info={info}
              active={form.watch("listingType") === type}
              onClick={(e) => {
                e.preventDefault();
                form.setValue("listingType", type);
              }}
            />
          ))}
        </div>
      </div>
    </TabsContent>
  );
};

export default TabListingTypes;
