"use client";
import React, { useContext } from "react";
import logo from "@/app/icon.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { authContext } from "../providers/auth-provider";

const NavBar = () => {
  const { user, signout } = useContext(authContext);

  return (
    <div className="h-[10vh] bg-card/95 flex justify-between px-[3vw] lg:px-[5vw] py-6 top-0 items-center fixed opacity-90 w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} width={45} height={45} alt="logo" />
        <h1 className="font-bold text-3xl text-primary">Rentify</h1>
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/start-renting">
          <Button variant="ghost" className="cursor-pointer" size="lg">
            Start renting
          </Button>
        </Link>

        {!user ? (
          <Link href="/signin">
            <Button variant="default" className="cursor-pointer" size="lg">
              Sign In
            </Button>
          </Link>
        ) : (
          <div className="flex gap-2 items-center">
            <p>Hello {user.firstName + " " + user.lastName}!</p>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={signout}
              size="lg"
            >
              Sign Out
            </Button>
          </div>
        )}

        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
