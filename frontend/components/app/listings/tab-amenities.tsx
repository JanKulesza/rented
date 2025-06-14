import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import { TabEnum } from "./add-property";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Tile from "@/components/elements/tile";

import { useFormContext } from "react-hook-form";
import { AmenityMappings } from "@/entities/amenities";
import { AddPropertySchemaType } from "./add-property-schema";

const TabAmenities = () => {
  const { watch, setValue } = useFormContext<AddPropertySchemaType>();

  return (
    <TabsContent value={TabEnum.Amenities}>
      <SheetHeader className="mb-3 px-0">
        <SheetTitle className="text-2xl">
          Showcase what amenities you can offer
        </SheetTitle>
        <SheetDescription>Make your offer stand out.</SheetDescription>
      </SheetHeader>
      {Object.values(AmenityMappings).map((type) => (
        <>
          <h3 className="text-xl font-semibold mb-3">{type.label}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {type.values.map((am) => {
              const active = watch("amenities").includes(am.value);
              const arr = watch("amenities");

              return (
                <Tile
                  key={am.value}
                  icon={am.icon}
                  label={am.label}
                  active={active}
                  onClick={(e) => {
                    e.preventDefault();
                    setValue(
                      "amenities",
                      !active
                        ? [...arr, am.value]
                        : arr.filter((a) => a !== am.value)
                    );
                  }}
                />
              );
            })}
          </div>
        </>
      ))}
    </TabsContent>
  );
};

export default TabAmenities;
