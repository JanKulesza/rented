import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Amenity, AmenityMappings } from "@/entities/amenities";
import React from "react";

const AmenitiesModal = ({ amenities }: { amenities: Amenity[] }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{`Show all ${amenities.length} amenities`}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-h-[80vh] sm:w-4/5 z-50 sm:max-w-2xl p-0 overflow-hidden">
        <div className="overflow-y-auto p-8 space-y-8 max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              What this place offers
            </DialogTitle>
            <DialogDescription>
              These are all of the amenities this place offers
            </DialogDescription>
          </DialogHeader>
          {Object.values(AmenityMappings).map((type) => {
            if (type.values.some((r) => amenities.includes(r.value)))
              return (
                <div key={type.label}>
                  <h3 className="font-semibold mb-6">{type.label}</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {type.values.map((am) => {
                      if (amenities.includes(am.value))
                        return (
                          <span
                            key={am.value}
                            className="min-h-6 text-sm items-center flex gap-3"
                          >
                            <am.icon strokeWidth={1.5} />
                            {am.label}
                          </span>
                        );
                    })}
                  </div>
                  <Separator />
                </div>
              );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AmenitiesModal;
