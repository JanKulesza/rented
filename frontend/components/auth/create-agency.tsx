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

enum CreateAgencyTabs {
  Credentials = "credentials",
  Agency = "agency",
}

const CreateAgencyForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<CreateAgencyTabs>(
    CreateAgencyTabs.Credentials
  );
  const { signin } = useContext(authContext);
  const router = useRouter();

  const form = useForm<CreateAgencyType>({
    resolver: zodResolver(createAgencySchema),
    defaultValues: {},
  });

  const onSubmit = async (values: CreateAgencyType) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/agencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, role: "owner" }),
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
            <div className="flex flex-col ">
              <Button
                variant="default"
                type="submit"
                className="cursor-pointer"
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
