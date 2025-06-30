import Tile from "@/components/elements/tile";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { TabsContent } from "@/components/ui/tabs";
import React, { useContext, useEffect } from "react";
import { TabEnum } from "./add-property";
import { useFormContext } from "react-hook-form";
import { AddPropertySchemaType } from "./add-property-schema";
import { agencyContext } from "@/components/providers/agency-provider";
import { ListingTypes } from "@/entities/listing-types";
import { User } from "@/components/providers/auth-provider";

const TabAgents = () => {
  const {
    agency: { agents },
  } = useContext(agencyContext);
  const { watch, setValue, getValues } =
    useFormContext<AddPropertySchemaType>();

  const isPending = getValues("listingType") === ListingTypes.PENDING;

  useEffect(() => {
    if (isPending) setValue("agent", null);
  }, [isPending]);

  return (
    <TabsContent value={TabEnum.Agents}>
      <SheetHeader className="mb-3 px-0">
        <SheetTitle className="text-2xl">Choose agent</SheetTitle>
        <SheetDescription>
          You can always reassign agent later.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-4">
        {isPending && (
          <p className="text-muted-foreground">
            Property listing is set to pending, assigning agent to pending
            property is disabled.
          </p>
        )}
        {(agents as User[]).map((a) => (
          <Tile
            disabled={isPending}
            key={a._id}
            alt={a.firstName + " " + a.lastName}
            src={a.image.url}
            label={a.firstName + " " + a.lastName}
            info={a.email}
            active={watch("agent") === a._id}
            onClick={(e) => {
              e.preventDefault();
              setValue("agent", a._id);
            }}
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default TabAgents;
