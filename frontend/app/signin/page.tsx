import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import skyscraper from "@/public/skyscraper.jpeg";
import SignInForm from "@/components/forms/signin";

const Signin = () => {
  return (
    <div className="flex h-[90vh]">
      <Card className="h-full w-full lg:w-2/5 gap-6 rounded-none flex flex-col justify-center items-center">
        <CardHeader className="text-center w-full">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Please enter your details.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link className="text-primary" href="/signup">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
      <Image
        className="h-full w-1/2 lg:w-3/5 hidden lg:block object-cover"
        src={skyscraper}
        alt="Skyscraper"
      />
    </div>
  );
};

export default Signin;
