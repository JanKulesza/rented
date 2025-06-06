"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
  Property,
  PropertyTypes,
} from "@/components/providers/agency-provider";
import { useContext, useState } from "react";
import Image from "next/image";
import { authContext, User } from "@/components/providers/auth-provider";
import userPlaceholder from "@/public/user-placeholder.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ZodError } from "zod";

interface AddPropertyProps {
  setProperties: (properties: Property[]) => void;
  properties: Property[];
}

const AddProperty = ({ setProperties, properties }: AddPropertyProps) => {
  const {
    agency,
    agency: { agents },
  } = useContext(agencyContext);
  const { fetchWithAuth } = useContext(authContext);
  const [isStatusPending, setIsStatusPending] = useState(false);
  const [tab, setTab] = useState<"step1" | "step2">("step1");
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<AddPropertySchemaType>({
    resolver: zodResolver(addPropertySchema),
  });
  const onSubmit = async (values: AddPropertySchemaType) => {
    const previousProperties = properties;
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      formData.append("agency", agency._id);

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
      setTab("step1");

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Property
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add property</DialogTitle>
          <DialogDescription>
            Fill out the form to add property
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, () => {
              const { image, name, description } = form.formState.errors;
              if (image || name || description) setTab("step1");
            })}
          >
            <Tabs className="space-y-3 w-full" value={tab}>
              <TabsList className="w-full p-0">
                <TabsTrigger
                  onClick={() => {
                    setTab("step1");
                  }}
                  value="step1"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Step 1
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    setTab("step2");
                  }}
                  value="step2"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Step 2
                </TabsTrigger>
              </TabsList>
              <TabsContent value="step1" className="space-y-5">
                <DragZone height={250} className="mb-5" />
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
              <TabsContent value="step2" className="space-y-5">
                <FormInput
                  name="location"
                  label="Location"
                  placeholder="Enter property location"
                />
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
                <div className="grid grid-cols-2 gap-3">
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
                </div>
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
                                  src={agent.image?.url || userPlaceholder}
                                  alt=""
                                  className="h-8 w-8 rounded-4xl"
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
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
              {tab === "step2" ? (
                <Button type="submit">Create Property</Button>
              ) : (
                <Button asChild>
                  <button type="button" onClick={() => setTab("step2")}>
                    Next
                  </button>
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProperty;
