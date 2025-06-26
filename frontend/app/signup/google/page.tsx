import GoogleOAuthSignUpForm from "@/components/auth/google-signup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GoogleOAuthSignUp = () => {
  return (
    <div className="flex p-8 justify-center w-full overflow-auto">
      <Card className="h-fit max-lg:w-full xl:w-1/2 gap-6 flex flex-col shadow-none border-none justify-center items-center">
        <CardHeader className="text-center w-full">
          <CardTitle className="text-2xl">Almost there...</CardTitle>
          <CardDescription>
            Please enter your details in order to finish signing up with Google.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full sm:px-16">
          <GoogleOAuthSignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuthSignUp;
