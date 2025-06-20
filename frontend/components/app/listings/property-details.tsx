"use client";
import { ListingTypes, Property } from "@/components/providers/agency-provider";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  editPropertySchema,
  EditPropertySchema,
} from "./add-property/edit-property-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { User } from "@/components/providers/auth-provider";
import { formatAddress } from "@/lib/utils";
import { MapPin, Move3D } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Tile from "@/components/elements/tile";
import { livingAreaMapping } from "@/entities/living-area";
import { LivingAreaType } from "./add-property/add-property-schema";
import { Separator } from "@/components/ui/separator";
import { listingTypesMapping } from "@/entities/listing-types";
import { AmenityMappings } from "@/entities/amenities";
import MiniCard from "../dashboard/mini-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Fragment, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ShowMore from "@/components/elements/show-more";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AddProperty from "./add-property/add-property";

interface PropertDetailsProps {
  p: Property;
}

const PropertyDetails = ({ p }: PropertDetailsProps) => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/elements/map/map"), {
        loading: () => <Skeleton />,
        ssr: false,
      }),
    []
  );

  const [property, setProperty] = useState(p);

  const { agencyId } = useParams();

  const agent = property.agent ? (property.agent as User) : null;
  const listingTypeMap = listingTypesMapping.find(
    (lt) => lt.type === property.listingType
  );

  return (
    <div className="space-y-10 max-sm:p-2">
      <div className="flex max-sm:flex-col-reverse gap-4">
        <div className="md:w-2/3 space-y-6 lg:space-y-10">
          <AspectRatio ratio={16 / 9} className="relative">
            <Image
              src={property.image.url}
              alt={property.propertyType}
              className="rounded-xl"
              fill
            />
          </AspectRatio>
          <section className="flex justify-between px-1">
            <div className="flex flex-col justify-between">
              <h2 className="sm:text-lg lg:text-2xl">
                {property.propertyType +
                  " in: " +
                  property.address.city +
                  ", " +
                  property.address.country}
              </h2>
              <span className="text-muted-foreground text-xs lg:text-sm">
                <MapPin className="inline w-5 h-5" strokeWidth={1.5} />{" "}
                {formatAddress(property.address)}
              </span>
            </div>
            <div>
              <h6 className="max-lg:text-sm">Price</h6>
              <span className="text-primary max-lg:text-2xl text-4xl">
                ${property.price}{" "}
              </span>
              <span className="text-muted-foreground max-lg:text-xs">
                {property.listingType === ListingTypes.RENT && " per month"}
              </span>
            </div>
          </section>
          <Separator />
          {typeof agent !== "string" && (
            <>
              <section className="px-1">
                {agent ? (
                  <MiniCard
                    label={
                      "Managed by: " + agent.firstName + " " + agent.lastName
                    }
                    info={agent.email}
                    image={agent.image.url}
                    href={`/app/${agencyId}/agents/${agent._id}`}
                  />
                ) : (
                  <div>
                    No agent assigned{" "}
                    <span className="text-sm block text-muted-foreground">
                      Listing type is set to pending. Cannot assign agent.
                    </span>
                  </div>
                )}
              </section>
              <Separator />
            </>
          )}
          <section className="px-1 space-y-5">
            {property.livingArea && (
              <div className="grid grid-cols-2 gap-2 p-2">
                {Object.keys(property.livingArea).map((la) => {
                  const { icon: Icon, label } =
                    livingAreaMapping[la as keyof LivingAreaType];
                  return (
                    <span
                      key={la}
                      className="text-foreground/80 text-sm items-center flex gap-3"
                    >
                      <Icon strokeWidth={1.5} />
                      {`${
                        property.livingArea![la as keyof LivingAreaType]
                      } ${label}`}
                    </span>
                  );
                })}
              </div>
            )}
            <Tile
              label={`${property.squareFootage} m²`}
              info="Square footage"
              className="w-full min-h-20 bg-muted/60 border-none shadow-none text-primary pointer-events-none "
              icon={Move3D}
            />
          </section>
          <Separator />
          <section className="px-1">
            <h6 className="text-xl font-semibold mb-6">About this place</h6>
            <ShowMore>
              <p>{property.description}</p>
            </ShowMore>
          </section>
          <Separator />
          <section className="px-1 space-y-6">
            <h6 className="text-xl font-semibold">What this place offers</h6>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.values(AmenityMappings).map((type) => {
                if (
                  type.values.some((r) =>
                    property.amenities.slice(0, 8).includes(r.value)
                  )
                )
                  return (
                    <Fragment key={type.label}>
                      {type.values.map((am) => {
                        if (property.amenities.slice(0, 8).includes(am.value))
                          return (
                            <span
                              key={am.value}
                              className="min-h-6 sm:text-sm items-center flex gap-3"
                            >
                              <am.icon strokeWidth={1.5} />
                              {am.label}
                            </span>
                          );
                      })}
                    </Fragment>
                  );
              })}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>{`Show all ${property.amenities.length} amenities`}</Button>
              </DialogTrigger>
              <DialogContent className="sm:h-8/10 sm:w-4/5 sm:max-w-2xl p-0 overflow-hidden">
                <div className="overflow-y-auto p-8 space-y-8">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      What this place offers
                    </DialogTitle>
                    <DialogDescription>
                      These are all of the amenities this place offers
                    </DialogDescription>
                  </DialogHeader>
                  {Object.values(AmenityMappings).map((type) => {
                    if (
                      type.values.some((r) =>
                        property.amenities.includes(r.value)
                      )
                    )
                      return (
                        <div key={type.label}>
                          <h3 className="font-semibold mb-6">{type.label}</h3>
                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {type.values.map((am) => {
                              if (property.amenities.includes(am.value))
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
          </section>
        </div>
        <div className="md:w-1/3 relative">
          <Card className="sticky top-28">
            <CardHeader className="text-lg font-semibold">
              Property Insights
              <CardDescription>
                See how this listing is performing.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tile
                label={property.listingType}
                info="Listing type"
                icon={listingTypeMap!.icon}
                className="w-full dark:bg-transparent bg-transparent has-[>svg]:px-0 p-0 min-h-10 min-w-10 pointer-events-none border-none shadow-none text-primary"
              />
              <div
                className="grid grid-cols-2 gap-4 text-sm opacity-30"
                aria-disabled={true}
              >
                <div>
                  <p className="text-muted-foreground">Total Views</p>
                  <p className="text-xl font-bold">248</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Leads</p>
                  <p className="text-xl font-bold">17</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Favorites</p>
                  <p className="text-xl font-bold">34</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CTR</p>
                  <p className="text-xl font-bold">2,78%</p>
                </div>
                Analytics coming soon
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <AddProperty
                className="w-full"
                editMode
                property={p}
                setProperty={(p) => setProperty(p)}
              />
              <Button variant="secondary" className="w-full">
                Full Analytics
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Separator />
      <section>
        <h6 className="text-xl font-semibold mb-3">Where you will live</h6>
        <p className="text-muted-foreground mb-5">
          {property.address.city +
            ", " +
            property.address.state +
            ", " +
            property.address.country}
        </p>
        <Map
          startPosition={[property.address.lat, property.address.lon]}
          height="400px"
        />
      </section>
    </div>
  );
};

export default PropertyDetails;
