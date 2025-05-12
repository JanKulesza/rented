import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import rent from "@/public/skyscraper.jpeg";
import CreateAgencyForm from "@/components/forms/create-agency";

const CreateAgency = () => {
  return (
    <div className="flex h-[90vh] min-h-fit">
      <Card className="h-full w-full lg:w-2/5 gap-6 rounded-none flex flex-col pt-[7%] items-center">
        <CardHeader className="text-center w-full">
          <CardTitle className="text-2xl">
            Welcome to <span className="text-primary">Rentify</span>
          </CardTitle>
          <CardDescription>
            Where your real estate dream come true.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
      <Image
        className="h-full lg:w-3/5 hidden lg:block object-cover"
        src={rent}
        alt="Rent"
      />
    </div>
  );
};

export default CreateAgency;
