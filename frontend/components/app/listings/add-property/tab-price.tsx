import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect } from "react";
import { TabEnum } from "./add-property";
import { useFormContext } from "react-hook-form";
import { AddPropertySchemaType } from "./add-property-schema";
import { ListingTypes } from "@/entities/listing-types";

const TabPrice = () => {
  const [MIN, MAX] = [1, 1000000000];
  const { register, watch, getValues, setValue } =
    useFormContext<AddPropertySchemaType>();
  const listingType = getValues("listingType");
  const value = watch("price");

  useEffect(() => {
    if (value > MAX) setValue("price", MAX);
    else if (value < MIN) setValue("price", MIN);
  });
  return (
    <TabsContent
      value={TabEnum.Price}
      className="flex flex-col space-y-6 h-full"
    >
      <SheetHeader className="mb-6 px-0">
        <SheetTitle className="text-2xl">
          Finally, set your property&apos;s price
        </SheetTitle>
        <SheetDescription>You can change this anytime.</SheetDescription>
      </SheetHeader>
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <span className="text-6xl font-bold">
          $
          <input
            type="number"
            {...register("price", { min: MIN, max: MAX })}
            className="border-0 shadow-none focus-visible:ring-0 outline-none
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{ width: `${(value.toString() ?? "1").length}ch` }}
          />
          {listingType === ListingTypes.RENT && " /month"}
        </span>
        <span className="text-muted-foreground">
          Buyer will pay ${Math.ceil(value * 1.1).toLocaleString()}{" "}
          {listingType === ListingTypes.RENT && " /month"}
        </span>
      </div>
    </TabsContent>
  );
};

export default TabPrice;
