import Tile from "@/components/elements/tile";
import { PropertyTypes } from "@/components/providers/agency-provider";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { TabsContent } from "@/components/ui/tabs";
import {
  Building,
  Building2,
  Factory,
  Fence,
  Home,
  Hotel,
  School,
  Store,
  Warehouse,
} from "lucide-react";
import React from "react";
import { TabEnum } from "./add-property";
import { useFormContext } from "react-hook-form";

const TabPropertyTypes = () => {
  const form = useFormContext();
  const icons = {
    [PropertyTypes.APARTMENT]: Hotel,
    [PropertyTypes.COMMERCIAL]: Store,
    [PropertyTypes.CONDO]: Building2,
    [PropertyTypes.HOUSE]: Home,
    [PropertyTypes.INDUSTRIAL]: Factory,
    [PropertyTypes.STUDIO]: Building,
    [PropertyTypes.TOWNHOUSE]: Fence,
    [PropertyTypes.VILLA]: School,
    [PropertyTypes.WAREHOUSE]: Warehouse,
  };
  return (
    <TabsContent value={TabEnum.PropertyType} className="flex flex-col">
      <SheetHeader className="mb-3 px-0">
        <SheetTitle className="text-2xl">Choose property type</SheetTitle>
        <SheetDescription>
          Which type describes your place the best?
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-1 justify-center items-center">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {Object.values(PropertyTypes).map((type) => (
            <Tile
              key={type}
              icon={icons[type]}
              label={type}
              active={form.watch("propertyType") === type}
              onClick={(e) => {
                e.preventDefault();
                form.setValue("propertyType", type);
              }}
            />
          ))}
        </div>
      </div>
    </TabsContent>
  );
};

export default TabPropertyTypes;
