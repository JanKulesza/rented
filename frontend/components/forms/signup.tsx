"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleCallback, setGoogleCallback] = useState<string | null>(null);
  const { signin } = useContext(authContext);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      confirmPassword: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (values: SignupSchemaType) => {
    const { firstName, lastName, email, password } = values;
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
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
      } else {
        const data = await res.json();

        if ("formErrors" in data) {
          toast.error("Invalid form data. Please check your inputs.");
        } else if ("error" in data && typeof data.error === "string")
          toast.error(data.error);
        else toast.error("Unexpected error occured. Please try again later.");
      }
    } catch (error) {
      toast.error("Unexpected error occured. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(
        "http://localhost:8080/api/auth/google/callback",
        {
          credentials: "include",
        }
      );
      if (res.status === 200) setGoogleCallback((await res.json()).url);
    })();
  }, []);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
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
        <Button variant="default" type="submit" className="mt-4 cursor-pointer">
          {isLoading ? <Spinner /> : "Sign Up"}
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
      </form>
    </Form>
  );
};

export default SignUpForm;
