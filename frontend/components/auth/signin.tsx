"use client";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import FormInput from "../inputs/form-input";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninSchemaType } from "./signin-schema";
import { Form } from "../ui/form";
import Spinner from "../ui/spinner";
import { authContext } from "../providers/auth-provider";
import { toast } from "sonner";
import GoogleOauthBtn from "./google-oauth-btn";

const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signin } = useContext(authContext);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
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

      if (res.ok) {
        router.push(redirectUrl ?? "/");
      } else if ([400, 401].includes(res.status)) {
        form.setError("email", { message: "Invalid credentials." });
        form.setError("password", { message: "Invalid credentials." });
      } else {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
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
          {isLoading ? <Spinner /> : "Sign in"}
        </Button>
        <GoogleOauthBtn isSignin />
      </form>
    </Form>
  );
};

export default SignInForm;
