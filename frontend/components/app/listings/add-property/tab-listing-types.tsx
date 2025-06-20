import Tile from "@/components/elements/tile";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TabsContent } from "@/components/ui/tabs";
import { TabEnum } from "./add-property";
import { useFormContext } from "react-hook-form";
import { listingTypesMapping } from "@/entities/listing-types";

const TabListingTypes = () => {
  const form = useFormContext();

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
          {listingTypesMapping.map(({ type, icon, info }) => (
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
