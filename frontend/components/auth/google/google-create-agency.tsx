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

const CreateAgencyGoogleForm = () => {
  const { setAuth } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CreateAgencyGoogleSchema>({
    resolver: zodResolver(createAgencyGoogleSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: {
        city: "",
        country: "",
        state: "",
        zip: "",
      },
    },
  });

  const onSubmit = async (values: CreateAgencyGoogleSchema) => {
    const { address, phone, name } = values;
    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/google/signup?type=agency",
        {
          method: "POST",
          body: JSON.stringify({
            phone,
            address,
            name,
          }),
          headers: { "Content-Type": "application/json" },
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
        <div className="flex max-md:flex-col gap-3 items-baseline md:justify-between">
          <FormInput
            name="address.city"
            label="City"
            placeholder="Warsaw"
            className="md:w-2/3"
          />
          <FormInput
            name="address.zip"
            label="Zip code"
            placeholder="00-001"
            className="md:w-1/3"
          />
        </div>
        <FormInput
          name="address.state"
          label="State"
          placeholder="Mazowieckie"
        />
        <FormInput
          name="address.country"
          label="Country"
          placeholder="Poland"
        />
        <Separator className="my-2" />
        <FormInput
          name="phone"
          label="Phone number"
          placeholder="+48 123 456 789"
          description="This is the user's personal phone number"
          className="mb-8"
        />
        <Button variant="default" type="submit" className="w-full">
          {isLoading ? <Spinner /> : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateAgencyGoogleForm;
