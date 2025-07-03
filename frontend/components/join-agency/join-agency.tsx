"use client";
import { useContext, useState } from "react";
import { authContext } from "../providers/auth-provider";
import { Button } from "../ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "../ui/card";
import Spinner from "../ui/spinner";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Agency } from "../providers/agency-provider";
import Tile from "../elements/tile";
import { Building2 } from "lucide-react";

interface JoinAgencyProps {
  redirectUrl: string;
  agency: Agency;
  token: string;
}

const JoinAgency = ({ token, agency, redirectUrl }: JoinAgencyProps) => {
  const { user, fetchWithAuth } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinAgency = async () => {
    if (!user)
      return toast.error("In order to join agency you need to sign in first.");

    setIsLoading(true);
    try {
      const { data, res } = await fetchWithAuth<object | { error: string }>(
        `http://localhost:8080/api/agencies/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, userId: user._id }),
        }
      );

      if (res.ok) {
        toast.success("Successfully joined agency.");
        router.push(`/app/${agency._id}`);
      } else {
        toast.error(
          "error" in data
            ? data.error
            : "Unexpected error occurred. Please try again later."
        );
      }
    } catch {
      toast.error("Unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card
      aria-disabled
      className="max-lg:w-full xl:w-1/2 space-y-4 shadow-none border-none justify-center items-center"
    >
      <CardHeader className="text-center w-full">
        <CardTitle className="text-2xl">
          {user
            ? `Hey ${user.firstName} ${user.lastName}`
            : "You have been invited to join agency."}
        </CardTitle>
        <CardDescription>
          {user
            ? "You have been invited to join an agency as the agent. Click below to join!"
            : "In order to join the agency you have to sign in first."}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full sm:px-16 space-y-8">
        <Tile
          icon={Building2}
          label={agency.name}
          info={agency.location}
          active
          className="w-full"
        />
        {user ? (
          <Button onClick={handleJoinAgency} className="w-full">
            {isLoading ? <Spinner /> : "Join agency"}
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link
              className="text-primary"
              href={`/signin?redirectUrl=${redirectUrl}`}
            >
              Sign in
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default JoinAgency;
