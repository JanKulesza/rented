import React from "react";
import logo from "@/app/icon.svg";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="bg-main h-4/5 flex justify-between px-[3vw] lg:px-[20vw] py-6 items-center shadow">
      <div className="flex items-center gap-2">
        <Image src={logo} width={45} height={45} alt="logo" />
        <h1 className="font-bold text-3xl  text-theme">rented</h1>
      </div>

      <div className="flex gap-4">
        <Link href="/">
          <Button variant="ghost" className="cursor-pointer" size="lg">
            Start renting
          </Button>
        </Link>
        <Link href="/">
          <Button variant="default" className="cursor-pointer" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
