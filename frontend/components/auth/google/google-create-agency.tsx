"use client";
import { authContext } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CreateAgencyGoogleSchema,
  createAgencyGoogleSchema,
} from "../create-agency-schema";
import FormInput from "@/components/inputs/form-input";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import useMap from "@/components/elements/map";

const CreateAgencyGoogleForm = () => {
  const Map = useMap();
  const { setAuth } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const [locationCorrect, setLocationCorrect] = useState(false);
  const router = useRouter();

  const form = useForm<CreateAgencyGoogleSchema>({
    resolver: zodResolver(createAgencyGoogleSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: {
        suite: "",
        address: "",
        city: "",
        country: "",
        state: "",
        zip: "",
      },
    },
  });

  const onSubmit = async (values: CreateAgencyGoogleSchema) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    Object.entries(values.address!).forEach(([field, val]) => {
      formData.append(`address[${field}]`, String(val));
    });

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/google/signup?type=agency",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (res.ok) {
        router.push(`/app/`);
        const data = await res.json();
        setAuth(data.token);
        router.replace(`/app/${data.entity._id}`);
        toast.success(
          `Your agency ${data.entity.name}, was created successfully!`
        );
      } else {
        const data = await res.json();

        if ("formErrors" in data) {
          toast.error("Invalid form data. Please check your inputs.");
        } else if ("error" in data && typeof data.error === "string")
          toast.error(data.error);
        else toast.error("Unexpected error occured. Please try again later.");
      }
    } catch {
      toast.error("Unexpected error occured. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormInput
          name="name"
          label="Agency Name"
          placeholder="Enter agency name"
          className="mb-2"
        />
        <Separator />
        <p className="text-sm text-muted-foreground my-2 px-1">
          This address will be used for both the owner and the agency.
        </p>
        <div className="flex max-md:flex-col gap-6">
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
            <FormInput name="address.city" label="City" placeholder="City" />
            <FormInput name="address.state" label="State" placeholder="State" />
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
            startPosition={[52.23, 21.01]}
            addr={form.watch("address")}
            useRecenter
            height="475px"
            onRecenter={(location) => {
              if (!location) setLocationCorrect(false);
              else {
                form.setValue("address.lat", +location.lat);
                form.setValue("address.lon", +location.lon);
                setLocationCorrect(true);
              }
            }}
          />
        </div>
        <Separator className="my-2" />
        <FormInput
          name="phone"
          label="Phone number"
          placeholder="+48 123 456 789"
          description="This is the user's personal phone number"
          className="mb-8"
        />
        <Button
          variant="default"
          type="submit"
          className="w-full"
          disabled={!locationCorrect}
        >
          {isLoading ? <Spinner /> : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateAgencyGoogleForm;
