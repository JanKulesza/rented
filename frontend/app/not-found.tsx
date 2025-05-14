import { Button } from "@/components/ui/button";
import { BadgeAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="p-8 text-center flex flex-col h-[80vh] gap-3 items-center justify-center">
      <BadgeAlert size={150} />
      <h2 className="text-xl font-semibold">Oops! An error occurred</h2>
      <p>Try refreshing this page or return to home page</p>
      <Button asChild className="mt-3">
        <Link href="/">Go to Home Page</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
