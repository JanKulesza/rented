"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import google from "@/public/google.svg";
import { Button } from "../ui/button";
import FormInput from "../inputs/form-input";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchemaType } from "./signup-schema";
import Spinner from "../ui/spinner";
import { authContext } from "../providers/auth-provider";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

enum SignUpTabs {
  Credentials = "credentials",
  Details = "details",
}

const SignUpForm = () => {
  const router = useRouter();
  const { signin } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<SignUpTabs>(SignUpTabs.Credentials);
  const [googleCallback, setGoogleCallback] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      confirmPassword: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: {
        city: "",
        country: "",
        state: "",
        zip: "",
      },
    },
  });

  const onSubmit = async (values: SignupSchemaType) => {
    const { firstName, lastName, email, password, address, phone } = values;
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          address,
          role: "user",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const res = await signin({ email, password });

        if (!res.ok) {
          router.push("/signin");
          return toast.error(
            "Failed to sign in. Please try signing in manually using credentials."
          );
        }

        router.push("/");
        toast.success(
          `${firstName} ${lastName}, your account was created successfully!`
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

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `http://localhost:8080/api/auth/google/callback?redirectUrl=${redirectUrl}`,
        {
          credentials: "include",
        }
      );
      if (res.status === 200) setGoogleCallback((await res.json()).url);
    })();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={tab} className="space-y-8">
          <TabsList className="w-full">
            <TabsTrigger
              value={SignUpTabs.Credentials}
              onClick={() => setTab(SignUpTabs.Credentials)}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Credentials
            </TabsTrigger>
            <TabsTrigger
              value={SignUpTabs.Details}
              onClick={() => setTab(SignUpTabs.Details)}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="credentials" className="flex flex-col gap-3">
            <FormInput
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
            />
            <div className="flex max-sm:flex-col gap-3 justify-between items-baseline mb-8">
              <FormInput
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your Password"
                className="sm:w-1/2"
              />
              <FormInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
                className="sm:w-1/2"
              />
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setTab(SignUpTabs.Details);
              }}
            >
              Next
            </Button>
            {googleCallback && (
              <Button
                variant="ghost"
                className="border-thin border border-zinc-300"
                asChild
              >
                <Link href={googleCallback}>
                  <Image src={google} alt="" className="w-8 h-8" />
                  Sign Up with Google
                </Link>
              </Button>
            )}
          </TabsContent>
          <TabsContent value="details" className="flex flex-col gap-3">
            <FormInput
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
            />

            <FormInput
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
            />
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
            <Button
              className="mt-8"
              onClick={(e) => {
                e.preventDefault();
                setTab(SignUpTabs.Credentials);
              }}
              variant="secondary"
            >
              Previous
            </Button>
            <Button variant="default" type="submit">
              {isLoading ? <Spinner /> : "Sign Up"}
            </Button>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default SignUpForm;
