"use client";

import google from "@/public/google.svg";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

const GoogleOauthBtn = ({
  to,
  isSignin,
}: {
  to?: string;
  isSignin?: boolean;
}) => {
  const [googleCallback, setGoogleCallback] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  to = `http://localhost:3000${to ?? ""}`;

  useEffect(() => {
    const paramsObj: Record<string, string> = { to };
    if (redirectUrl) paramsObj.redirectUrl = redirectUrl;
    const query = new URLSearchParams(paramsObj);
    (async () => {
      const res = await fetch(
        `http://localhost:8080/api/auth/google/callback?${query}`,
        {
          credentials: "include",
        }
      );
      if (res.status === 200) setGoogleCallback((await res.json()).url);
    })();
  }, [to, redirectUrl]);

  return (
    <>
      {googleCallback && (
        <Button
          variant="ghost"
          className="border-thin border border-zinc-300"
          asChild
        >
          <Link href={googleCallback}>
            <Image src={google} alt="" className="w-8 h-8" />
            Sign {isSignin ? "in" : "up"} with Google
          </Link>
        </Button>
      )}
    </>
  );
};

export default GoogleOauthBtn;
