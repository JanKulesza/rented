"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  addPropertySchema,
  AddPropertySchemaType,
  addressSchema,
} from "./add-property-schema";
import DragZone from "@/components/elements/drag-zone";
import FormInput from "@/components/inputs/form-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  agencyContext,
  ListingTypes,
  Property,
  PropertyTypes,
} from "@/components/providers/agency-provider";
import { useContext, useMemo, useState } from "react";
import Image from "next/image";
import { authContext, User } from "@/components/providers/auth-provider";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

interface AddPropertyProps {
  setProperties: (properties: Property[]) => void;
  properties: Property[];
}

enum TabEnum {
  Info = "info",
  Location = "location",
  Details = "details",
}

const AddProperty = ({ setProperties, properties }: AddPropertyProps) => {
  const {
    agency,
    agency: { agents },
  } = useContext(agencyContext);
  const { fetchWithAuth } = useContext(authContext);

  const [isStatusPending, setIsStatusPending] = useState(false);
  const [tab, setTab] = useState<TabEnum>(TabEnum.Info);
  const [isOpen, setIsOpen] = useState(false);
  const [locationCorrect, setLocationCorrect] = useState(false);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/elements/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const form = useForm<AddPropertySchemaType>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: {
      agent: "",
      address: {
        address: "",
        suite: "",
        city: "",
        state: "",
        country: "",
        zip: "",
      },
      name: "",
      description: "",
      price: 0,
      propertyType: PropertyTypes.APARTAMENT,
      listingType: ListingTypes.RENT,
    },
  });

  const onSubmit = async (values: AddPropertySchemaType) => {
    const previousProperties = properties;
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", String(values.price));
      formData.append("listingType", values.listingType);
      formData.append("propertyType", values.propertyType);

      if (values.agent) formData.append("agent", values.agent);

      formData.append("agency", agency._id);
      formData.append("image", values.image, values.image.name);

      // Append nested address fields using bracket notation
      Object.entries(values.address).forEach(([field, val]) => {
        formData.append(`address[${field}]`, String(val));
      });

      setProperties([
        {
          ...values,
          _id: "dummy", // Placeholder, will be replaced by server response
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rating: 0,
          isSold: false,
          agency: agency._id,
          image: { url: URL.createObjectURL(values.image), id: "dummy" }, // Will be replaced by server response
        } as Property,
        ...previousProperties,
      ]);
      setIsOpen(false);
      setTab(TabEnum.Info);

      const { res, data } = await fetchWithAuth<Property>(
        "http://localhost:8080/api/properties",
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        form.reset();
        setIsStatusPending(false);
        setProperties([data, ...previousProperties]);
        toast.success("Property added successfully!");
      } else {
        setProperties(previousProperties);
        if ("formErrors" in data) {
          setIsOpen(true);
          toast.error("Invalid form data. Please check your inputs.");
        } else if ("error" in data && typeof data.error === "string")
          toast.error(data.error);
        else toast.error("Unexpected error occured. Please try again later.");
      }
    } catch (error) {
      toast.error("Unexpected error occured. Please try again later.");
      setProperties(previousProperties);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus /> Add Property
        </Button>
      </SheetTrigger>
      <SheetContent className="w-9/10 md:w-3/5 md:max-w-9/10 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add property</SheetTitle>
          <SheetDescription>Fill out the form to add property</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, () => {
              const { image, name, description } = form.formState.errors;
              if (image || name || description) setTab(TabEnum.Info);
            })}
            className="flex flex-col justify-between h-full"
          >
            <Tabs className="px-4" value={tab}>
              <TabsContent value="info" className="space-y-6">
                <DragZone height={300} className="mb-5" />
                <FormInput
                  name="name"
                  label="Name"
                  placeholder="Enter property name"
                />
                <FormInput
                  variant="textarea"
                  label="Description"
                  name="description"
                  placeholder="Tell something about property..."
                />
              </TabsContent>
              <TabsContent
                value={TabEnum.Location}
                className="flex max-md:flex-col gap-6"
              >
                <div className="md:w-2/3 space-y-6 ">
                  <FormInput
                    name="address.address"
                    label="Address"
                    placeholder="Address"
                  />
                  <FormInput
                    name="address.suite"
                    label="Suite"
                    placeholder="Suite (optional)"
                  />
                  <FormInput
                    name="address.city"
                    label="City"
                    placeholder="City"
                  />
                  <FormInput
                    name="address.state"
                    label="State"
                    placeholder="State"
                  />
                  <FormInput
                    name="address.country"
                    label="Country"
                    placeholder="Country"
                  />
                  <FormInput
                    name="address.zip"
                    label="Zip Code"
                    placeholder="Zip Code"
                  />
                </div>
                <Map
                  addr={form.watch("address")}
                  useRecenter
                  onRecenter={(location) => {
                    if (!location) setLocationCorrect(false);
                    else {
                      console.log(location);

                      form.setValue("address.lat", +location.lat);
                      form.setValue("address.lon", +location.lon);
                      setLocationCorrect(true);
                    }
                  }}
                />
              </TabsContent>
              <TabsContent value={TabEnum.Details} className="space-y-6">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Listing type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PropertyTypes).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormInput
                  name="price"
                  type="number"
                  label="Price"
                  placeholder="Enter price"
                />
                <FormField
                  control={form.control}
                  name="listingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Listing Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          setIsStatusPending(value === "Pending");
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Listing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Sale">Sale</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={
                          isStatusPending ? "text-muted-foreground" : ""
                        }
                      >
                        Assign Agent
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className="w-full h-36 py-6"
                          disabled={isStatusPending}
                        >
                          <SelectValue
                            className="h-12"
                            placeholder="Select agent"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(agents as User[]).map((agent) => (
                            <SelectItem key={agent._id} value={agent._id}>
                              <div className="flex gap-3 items-center">
                                <Image
                                  src={agent.image.url}
                                  alt="CN"
                                  height={32}
                                  width={32}
                                  className="rounded-4xl"
                                />
                                <div className="flex flex-col items-baseline">
                                  <span>
                                    {agent.firstName + " " + agent.lastName}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {agent.email}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isStatusPending && (
                        <FormDescription>
                          Property listing is set to pending, assigning agent to
                          pending property is disabled.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <SheetFooter>
              <Progress
                className="w-full mb-3"
                value={
                  (100 / Object.values(TabEnum).length) *
                  (Object.values(TabEnum).indexOf(tab) + 1)
                }
              />
              <div className="flex justify-between">
                <Button
                  variant="secondary"
                  disabled={tab === TabEnum.Info}
                  onClick={(e) => {
                    e.preventDefault();
                    setTab(
                      Object.values(TabEnum)[
                        Object.values(TabEnum).indexOf(tab) - 1
                      ]
                    );
                  }}
                >
                  Previous
                </Button>
                {tab === TabEnum.Details ? (
                  <Button type="submit">Create Property</Button>
                ) : (
                  <Button
                    type="button"
                    disabled={((): boolean => {
                      switch (tab) {
                        case TabEnum.Info:
                          const [image, name, description] = form.watch([
                            "image",
                            "name",
                            "description",
                          ]);

                          const { success } = addPropertySchema
                            .partial()
                            .safeParse({ image, name, description });

                          if (!success) return true;
                          break;
                        case TabEnum.Location:
                          console.log(form.watch("address"));

                          if (
                            !addressSchema.safeParse(form.watch("address"))
                              .success ||
                            !locationCorrect
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
                      setTab(
                        Object.values(TabEnum)[
                          Object.values(TabEnum).indexOf(tab) + 1
                        ]
                      );
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
