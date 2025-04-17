import React from "react";
import logo from "@/app/icon.svg";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "./ui/mode-toggle";

const NavBar = () => {
  return (
    <div className="bg-card h-[10vh] flex justify-between px-[3vw] lg:px-[5vw] py-6 items-center shadow">
      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} width={45} height={45} alt="logo" />
        <h1 className="font-bold text-3xl text-primary">rented</h1>
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/start-renting">
          <Button variant="ghost" className="cursor-pointer" size="lg">
            Start renting
          </Button>
        </Link>
        <Link href="/signin">
          <Button variant="default" className="cursor-pointer" size="lg">
            Sign In
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
