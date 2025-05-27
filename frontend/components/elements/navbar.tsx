"use client";
import React, { useContext } from "react";
import logo from "@/app/icon.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { authContext } from "../providers/auth-provider";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./profile-dropdown";

const NavBar = () => {
  const { user } = useContext(authContext);
  const path = usePathname();

  return (
    <div
      className={`h-[10vh] bg-sidebar border-sidebar-border border-b flex justify-between px-3 ${
        !path.startsWith("/app") && "lg:px-10"
      } py-6 top-0 items-center fixed w-full z-50`}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} width={45} height={45} alt="logo" />
        <h1 className="font-bold text-3xl text-primary">Rented</h1>
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
          <ProfileDropdown user={user} />
        )}

        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
