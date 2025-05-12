"use client";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import FormInput from "../inputs/form-input";
import Link from "next/link";
import google from "@/public/google.svg";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninSchemaType } from "./signin-schema";
import { Form } from "../ui/form";
import Image from "next/image";
import Spinner from "../ui/spinner";
import { authContext } from "../providers/auth-provider";

const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleCallback, setGoogleCallback] = useState<string | null>(null);
  const { signin } = useContext(authContext);
  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SigninSchemaType) => {
    try {
      setIsLoading(true);
      const res = await signin(values);

      if (res.status === 200) {
        router.push("/");
      }
      if (res.status === 401) {
        form.setError("email", { message: "Invalid credentials." });
        form.setError("password", { message: "Invalid credentials." });
      }
    } catch (error) {
      console.log(error);
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
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          size={50}
        />
        <FormInput
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          size={50}
        />

        <Button variant="default" type="submit" className="mt-4 cursor-pointer">
          {isLoading ? <Spinner /> : "Log in"}
        </Button>
        {googleCallback && (
          <Button
            variant="ghost"
            className="border-thin border border-zinc-300 cursor-pointer"
            asChild
          >
            <Link href={googleCallback}>
              <Image src={google} alt="" className="w-8 h-8" />
              Sign In with Google
            </Link>
          </Button>
        )}
      </form>
    </Form>
  );
};

export default SignInForm;
