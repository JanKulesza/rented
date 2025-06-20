import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { TabsContent } from "@/components/ui/tabs";
import IncrementInput from "@/components/inputs/increment-input";
import { AddPropertySchemaType, LivingAreaType } from "./add-property-schema";
import { TabEnum } from "./add-property";
import { PropertyTypes } from "@/components/providers/agency-provider";
import { capitalize } from "@/lib/utils";

const residentialTypes = [
  PropertyTypes.HOUSE,
  PropertyTypes.APARTMENT,
  PropertyTypes.CONDO,
  PropertyTypes.STUDIO,
  PropertyTypes.TOWNHOUSE,
  PropertyTypes.VILLA,
];

export default function TabLivingArea() {
  const { watch, setValue } = useFormContext<AddPropertySchemaType>();
  const { propertyType, livingArea } = watch();

  const isResidential = residentialTypes.includes(propertyType);
  const fields = livingArea
    ? (Object.entries(livingArea) as Array<[keyof typeof livingArea, number]>)
    : [];

  useEffect(() => {
    if (!isResidential) setValue(`livingArea`, null);
    else if (!livingArea) {
      setValue("livingArea", {
        bathrooms: 1,
        bedrooms: 1,
        beds: 1,
        kitchens: 1,
      });
    } else
      for (const key in livingArea)
        setValue(
          `livingArea.${key as keyof LivingAreaType}`,
          watch(`livingArea.${key as keyof LivingAreaType}`) ?? 1
        );
  }, [isResidential]);

  return (
    <TabsContent value={TabEnum.LivingArea}>
      <SheetHeader className="mb-3 px-0">
        <SheetTitle className="text-2xl">
          Provide info about living area
        </SheetTitle>
        <SheetDescription>You can change it later.</SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-4">
        {isResidential &&
          fields.map(([field, value]) => (
            <IncrementInput
              key={field}
              name={`livingArea.${field}`}
              label={capitalize(field)}
              defaultValue={value}
              min={1}
              max={50}
            />
          ))}
        <IncrementInput
          label="Square Footage (m²)"
          name="squareFootage"
          min={1}
          defaultValue={82}
        />
      </div>
    </TabsContent>
  );
}
