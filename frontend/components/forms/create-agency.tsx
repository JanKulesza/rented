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

const CreateAgencyForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<"owner" | "agency">("owner");
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

      if (res.status === 201) {
        const { email, password } = values;
        const authRes = await signin({ email, password });

        if (authRes.status === 200) router.push(`/app/${data._id}`);
        else router.push("/signin");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs className="space-y-8 w-full" value={tab}>
          <TabsList className="w-full  p-0">
            <TabsTrigger
              value="owner"
              onClick={() => {
                setTab("owner");
              }}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Owner details
            </TabsTrigger>
            <TabsTrigger
              value="agency"
              onClick={() => {
                setTab("agency");
              }}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Agency details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="owner" className="flex flex-col gap-3">
            <FormInput
              name="firstName"
              size={50}
              label="First Name"
              placeholder="Enter your first name"
            />

            <FormInput
              name="lastName"
              size={50}
              label="Last Name"
              placeholder="Enter your last name"
            />

            <FormInput
              name="email"
              size={50}
              type="email"
              label="Email"
              placeholder="Enter your email"
            />
            <div className="flex gap-3 justify-between">
              <FormInput
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your Password"
              />
              <FormInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            <Button
              variant="default"
              className="mt-4 cursor-pointer"
              onClick={() => setTab("agency")}
            >
              Next
            </Button>
          </TabsContent>
          <TabsContent value="agency" className="flex flex-col gap-3">
            <FormInput
              name="name"
              size={50}
              label="Agency Name"
              placeholder="Enter agency name"
            />

            <FormInput
              name="location"
              size={50}
              label="Location"
              placeholder="Enter agency location"
            />

            <div className="flex flex-col ">
              <Button
                variant="default"
                type="submit"
                className="mt-4 cursor-pointer"
              >
                {isLoading ? <Spinner /> : "Sign Up"}
              </Button>
              <Button
                variant="secondary"
                className="mt-4 cursor-pointer"
                onClick={() => {
                  setTab("owner");
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
