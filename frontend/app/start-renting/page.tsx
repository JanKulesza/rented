import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import CreateAgencyForm from "@/components/auth/create-agency";

const CreateAgency = () => {
  return (
    <div className="flex p-8 justify-center w-full overflow-auto">
      <Card className="h-fit max-lg:w-full xl:w-1/2 gap-6 flex flex-col shadow-none border-none justify-center items-center">
        <CardHeader className="text-center w-full">
          <CardTitle className="text-2xl">
            Welcome to <span className="text-primary">Rented</span>
          </CardTitle>
          <CardDescription>
            Where your real estate dream come true.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full sm:px-16">
          <CreateAgencyForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            Already have an agency?{" "}
            <Link className="text-primary" href="/signin">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateAgency;
