"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  addPropertySchema,
  AddPropertySchemaType,
  addressSchema,
} from "./add-property-schema";
import {
  agencyContext,
  ListingTypes,
  Property,
  PropertyTypes,
} from "@/components/providers/agency-provider";
import { useContext, useState } from "react";
import { authContext } from "@/components/providers/auth-provider";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import "leaflet/dist/leaflet.css";
import TabListingTypes from "./tab-listing-types";
import TabPropertyTypes from "./tab-property-types";
import TabAddress from "./tab-address";
import TabLivingArea from "./tab-living-area";
import TabInfo from "./tab-info";
import TabAmenities from "./tab-amenities";
import TabAgents from "./tab-agents";
import TabPrice from "./tab-price";
import { EditPropertySchema, editPropertySchema } from "./edit-property-schema";

interface AddProperty {
  editMode?: false;
  setProperties: (properties: Property[]) => void;
  properties: Property[];
  setProperty?: never;
  property?: never;
  className?: string;
}

interface EditProperty {
  editMode: true;
  setProperty: (property: Property) => void;
  property: Property;
  setProperties?: never;
  properties?: never;
  className?: string;
}

type AddPropertyProps = AddProperty | EditProperty;

export enum TabEnum {
  PropertyType = "propertyType",
  ListingType = "listingType",
  Location = "location",
  LivingArea = "livingArea",
  Amenities = "amenities",
  Info = "info",
  Agents = "agents",
  Price = "price",
}

const tabEnumArr = Object.values(TabEnum);

const AddProperty = ({
  editMode,
  properties,
  property,
  setProperty,
  setProperties,
  className,
}: AddPropertyProps) => {
  const {
    agency: { _id: agencyId },
  } = useContext(agencyContext);
  const { fetchWithAuth } = useContext(authContext);

  const [tab, setTab] = useState<TabEnum>(TabEnum.PropertyType);
  const [isOpen, setIsOpen] = useState(false);
  const [locationCorrect, setLocationCorrect] = useState(false);

  const defaultValues = editMode
    ? {
        agent:
          typeof property.agent === "object" &&
          property.agent &&
          "_id" in property.agent
            ? property.agent._id
            : property.agent,
        address: property.address,
        description: property.description,
        price: property.price,
        propertyType: property.propertyType,
        listingType: property.listingType,
        squareFootage: property.squareFootage,
        livingArea: property.livingArea,
        amenities: property.amenities,
      }
    : null;

  const form = useForm<AddPropertySchemaType | EditPropertySchema>({
    resolver: zodResolver(editMode ? editPropertySchema : addPropertySchema),
    defaultValues: defaultValues ?? {
      agent: "",
      address: {
        address: "",
        suite: "",
        city: "",
        state: "",
        country: "",
        zip: "",
      },
      description: "",
      price: 430,
      propertyType: PropertyTypes.APARTMENT,
      listingType: ListingTypes.RENT,
      squareFootage: 82,
      livingArea: {
        beds: 1,
        bedrooms: 1,
        bathrooms: 1,
        kitchens: 1,
      },
      amenities: [],
    },
  });

  const onSubmit = async (
    values: AddPropertySchemaType | EditPropertySchema
  ) => {
    const formData = new FormData();
    for (const key in values) {
      const val = values[key as keyof typeof values];
      if (val && !["address", "livingArea", "image"].includes(key))
        formData.append(key, String(val));
    }
    if (values.image) formData.append("image", values.image, values.image.name);

    // Append nested address fields using bracket notation
    Object.entries(values.address!).forEach(([field, val]) => {
      formData.append(`address[${field}]`, String(val));
    });
    if (values.livingArea)
      Object.entries(values.livingArea).forEach(([field, val]) => {
        formData.append(`livingArea[${field}]`, String(val));
      });
    else formData.append("livingArea", String(null));

    if (editMode) {
      const previousProperty = property;
      setProperty({
        ...property,
        ...values,
        agent: "dummy",
        image: values.image
          ? { id: "dummy", url: URL.createObjectURL(values.image) }
          : property.image,
      } as Property);
      setIsOpen(false);
      setTab(tabEnumArr[0]);

      try {
        const { res, data } = await fetchWithAuth<Property>(
          `http://localhost:8080/api/properties/${property._id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (res.ok) {
          toast.success("Property added successfully!");
          setProperty(data);
        } else {
          setProperty(previousProperty);
          if ("formErrors" in data) {
            setIsOpen(true);
            toast.error(`Invalid form data. Please check your inputs.`);
          } else if ("error" in data && typeof data.error === "string")
            toast.error(data.error);
          else toast.error("Unexpected error occured. Please try again later.");
        }
      } catch (_) {
        setProperty(previousProperty);
        toast.error("Unexpected error occured. Please try again later.");
      }
    } else {
      formData.append("agency", agencyId);
      const previousProperties = properties;
      setProperties([
        {
          ...values,
          _id: "dummy", // Placeholder, will be replaced by server response
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rating: 0,
          isSold: false,
          agency: agencyId,
          image: { url: URL.createObjectURL(values.image!), id: "dummy" }, // Will be replaced by server response
        } as Property,
        ...previousProperties,
      ]);
      setIsOpen(false);
      setTab(tabEnumArr[0]);

      try {
        const { res, data } = await fetchWithAuth<Property>(
          "http://localhost:8080/api/properties",
          {
            method: "POST",
            body: formData,
          }
        );

        if (res.ok) {
          form.reset();
          setProperties([data, ...previousProperties]);
          toast.success("Property added successfully!");
        } else {
          setProperties(previousProperties);
          if ("formErrors" in data) {
            setIsOpen(true);
            console.log(data);

            toast.error(`Invalid form data. Please check your inputs.`);
          } else if ("error" in data && typeof data.error === "string")
            toast.error(data.error);
          else toast.error("Unexpected error occured. Please try again later.");
        }
      } catch (_) {
        toast.error("Unexpected error occured. Please try again later.");
        setProperties(previousProperties);
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className={className}>
          {!editMode ? (
            <>
              <Plus /> Add Property
            </>
          ) : (
            <>
              <SquarePen /> Edit Property
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-9/10 sm:w-4/5 md:w-4/5 lg:w-3/5 sm:max-w-9/10 pt-6 px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, () => {
              const { image, description } = form.formState.errors;
              if (image || description) setTab(TabEnum.Info);
            })}
            className="flex flex-col gap-4 h-full relative"
          >
            <Tabs
              value={tab}
              className="overflow-y-auto flex-1 h-[calc(100% - 7rem)]"
            >
              <TabPropertyTypes />
              <TabListingTypes />
              <TabAddress
                setLocationCorrect={(correct: boolean) =>
                  setLocationCorrect(correct)
                }
              />
              <TabLivingArea />
              <TabAmenities />
              <TabInfo />
              <TabAgents />
              <TabPrice />
            </Tabs>
            <SheetFooter className="px-0 h-28 flex-none">
              <Progress
                className="w-full mb-3"
                value={
                  (100 / tabEnumArr.length) * (tabEnumArr.indexOf(tab) + 1)
                }
              />
              <div className="flex justify-between">
                <Button
                  variant="secondary"
                  disabled={tab === tabEnumArr[0]}
                  onClick={(e) => {
                    e.preventDefault();
                    setTab(tabEnumArr[tabEnumArr.indexOf(tab) - 1]);
                  }}
                >
                  Previous
                </Button>
                {tab === tabEnumArr[tabEnumArr.length - 1] ? (
                  <Button type="submit">
                    {editMode ? "Edit Property" : "Create Property"}{" "}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={((): boolean => {
                      switch (tab) {
                        case TabEnum.Info:
                          const [image, description] = form.watch([
                            "image",
                            "description",
                          ]);

                          const { success } = addPropertySchema
                            .partial({
                              address: true,
                              agent: true,
                              amenities: true,
                              listingType: true,
                              livingArea: true,
                              price: true,
                              propertyType: true,
                              squareFootage: true,
                              image: !editMode ? undefined : true,
                            })
                            .safeParse({ image, description });

                          if (!success) return true;
                          break;
                        case TabEnum.Location:
                          if (
                            !addressSchema.safeParse(form.watch("address"))
                              .success ||
                            !locationCorrect
                          )
                            return true;
                          break;
                        case TabEnum.Agents:
                          if (
                            form.watch("listingType") !==
                              ListingTypes.PENDING &&
                            !form.watch("agent")
                          )
                            return true;
                          break;
                        default:
                          break;
                      }

                      return false;
                    })()}
                    onClick={(e) => {
                      e.preventDefault();
                      setTab(tabEnumArr[tabEnumArr.indexOf(tab) + 1]);
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddProperty;
