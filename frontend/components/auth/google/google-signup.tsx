"use client";
import { useContext, useState } from "react";
import { googleSignupSchema, GoogleSignupSchema } from "./google-signup-schema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import Spinner from "../../ui/spinner";
import { Form } from "../../ui/form";
import FormInput from "../../inputs/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { authContext } from "../../providers/auth-provider";

const GoogleOAuthSignUpForm = () => {
  const { setAuth } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  const router = useRouter();

  const form = useForm<GoogleSignupSchema>({
    resolver: zodResolver(googleSignupSchema),
    defaultValues: {
      phone: "",
      address: {
        city: "",
        country: "",
        state: "",
        zip: "",
      },
    },
  });

  const onSubmit = async (values: GoogleSignupSchema) => {
    const { address, phone, role } = values;
    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/google/signup?type=user",
        {
          method: "POST",
          body: JSON.stringify({
            phone,
            address,
            role: role ?? "user",
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (res.ok) {
        router.push(redirectUrl ?? "/");
        setAuth((await res.json()).token);
        toast.success("Your account was created successfully!");
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          name="phone"
          label="Phone Number"
          placeholder="+48123456789"
        />
        <div className="flex max-md:flex-col gap-3 items-baseline md:justify-between">
          <FormInput
            name="address.city"
            label="City"
            placeholder="Warsaw"
            className="md:w-2/3 w-full"
          />
          <FormInput
            name="address.zip"
            label="Zip code"
            placeholder="00-001"
            className="md:w-1/3 w-full"
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
        <Button variant="default" type="submit" className="w-full mt-5">
          {isLoading ? <Spinner /> : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default GoogleOAuthSignUpForm;
