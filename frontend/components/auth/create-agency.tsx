"use client";
import { useContext, useState } from "react";
import { Form } from "../ui/form";
import { createAgencySchema, CreateAgencyType } from "./create-agency-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Spinner from "../ui/spinner";
import { Button } from "../ui/button";
import FormInput from "../inputs/form-input";
import { useRouter } from "next/navigation";
import { authContext } from "../providers/auth-provider";
import { toast } from "sonner";
import GoogleOauthBtn from "./google-oauth-btn";
import { Separator } from "../ui/separator";
import useMap from "../elements/map";

enum CreateAgencyTabs {
  Credentials = "credentials",
  Agency = "agency",
}

const CreateAgencyForm = () => {
  const Map = useMap();
  const [isLoading, setIsLoading] = useState(false);
  const [locationCorrect, setLocationCorrect] = useState(false);
  const [tab, setTab] = useState<CreateAgencyTabs>(
    CreateAgencyTabs.Credentials
  );
  const { signin } = useContext(authContext);
  const router = useRouter();

  const form = useForm<CreateAgencyType>({
    resolver: zodResolver(createAgencySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      email: "",
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

  const onSubmit = async (values: CreateAgencyType) => {
    setIsLoading(true);
    const formData = new FormData();
    for (const key in values) {
      if (key !== "address") {
        const value = values[key as keyof typeof values];
        if (value && typeof value !== "object") {
          formData.append(key, String(value));
        }
      }
    }

    Object.entries(values.address!).forEach(([field, val]) => {
      formData.append(`address[${field}]`, String(val));
    });
    try {
      const res = await fetch("http://localhost:8080/api/agencies", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const { email, password } = values;
        const authRes = await signin({ email, password });

        if (authRes.ok) {
          router.push(`/app/${data._id}`);
          toast.success(`Your agency ${data.name}, was created successfully!`);
        } else {
          router.push("/signin");
          toast.error(
            "Failed to sign in. Please try signing in manually using credentials."
          );
        }
      } else {
        if ("formErrors" in data) {
          toast.error("Invalid form data. Please check your inputs.");
        } else if ("error" in data && typeof data.error === "string")
          toast.error(data.error);
        else toast.error("Unexpected error occured. Please try again later.");
      }
    } catch {
      toast.error("Unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs className="space-y-8 w-full" value={tab}>
          <TabsList className="w-full p-0">
            <TabsTrigger
              value={CreateAgencyTabs.Credentials}
              onClick={() => {
                setTab(CreateAgencyTabs.Credentials);
              }}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Credentials
            </TabsTrigger>
            <TabsTrigger
              value={CreateAgencyTabs.Agency}
              onClick={() => {
                setTab(CreateAgencyTabs.Agency);
              }}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Agency
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value={CreateAgencyTabs.Credentials}
            className="flex flex-col gap-3"
          >
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
                setTab(CreateAgencyTabs.Agency);
              }}
            >
              Next
            </Button>
            <GoogleOauthBtn to="/start-renting/google" />
          </TabsContent>
          <TabsContent
            value={CreateAgencyTabs.Agency}
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
            <div className="flex flex-col ">
              <Button
                variant="default"
                type="submit"
                className="cursor-pointer"
                disabled={!locationCorrect}
              >
                {isLoading ? <Spinner /> : "Sign Up"}
              </Button>
              <Button
                variant="secondary"
                className="mt-4 cursor-pointer"
                onClick={() => {
                  setTab(CreateAgencyTabs.Credentials);
                }}
              >
                Previous
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default CreateAgencyForm;
