import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SignUpForm from "@/components/auth/signup";

const Signin = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirectUrl: string }>;
}) => {
  const { redirectUrl } = await searchParams;
  return (
    <div className="flex p-8 justify-center w-full overflow-auto">
      <Card className="h-fit max-lg:w-full xl:w-1/2 gap-6 flex flex-col shadow-none border-none justify-center items-center">
        <CardHeader className="text-center w-full">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Please enter your details in order to sign up.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full sm:px-16">
          <SignUpForm />
        </CardContent>
        <CardFooter className="text-center">
          <p>
            Already have an account?{" "}
            <Link
              className="text-primary"
              href={`/signin${redirectUrl && `?redirectUrl=${redirectUrl}`}`}
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signin;
