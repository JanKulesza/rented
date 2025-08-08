"use client";
import { authContext, User } from "../providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Building2,
  CircleHelp,
  CircleUser,
  DoorOpen,
  Globe,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import rentedIcon from "@/app/icon.svg";
import { UserRoles } from "../auth/signup-schema";
import { ModeToggle } from "../ui/mode-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

const ProfileDropdown = ({ user }: { user: User }) => {
  const { signout } = useContext(authContext);
  const isMobile = useIsMobile();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center gap-3 p-8"
        >
          <Image
            src={user.image.url}
            alt="CN"
            height={44}
            width={44}
            className="rounded-4xl"
          />
          {!isMobile && (
            <div className="flex flex-col items-baseline">
              <span>{user.firstName + " " + user.lastName}</span>
              <span className="text-muted-foreground">{user.email}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-64 m-1.5 bg-sidebar">
        {[UserRoles.OWNER, UserRoles.AGENT].includes(user.role) && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/app/${user.agency}`} className="space-x-1">
                <Building2 style={{ height: 18, width: 18 }} />
                <span>My Agency</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/me" className="space-x-1">
            <CircleUser style={{ height: 18, width: 18 }} />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled>
          <Link href="/me/whishlist" className="space-x-1">
            <Heart style={{ height: 18, width: 18 }} />
            <span>Whishlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled>
          <Link
            href="/me/rented"
            className="space-x-1 text-primary focus:text-primary font-bold"
          >
            <Image src={rentedIcon} alt="" style={{ height: 18, width: 18 }} />
            <span>My Rented</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="space-x-1" disabled>
          <Globe style={{ height: 18, width: 18 }} />
          <span>Language & Currency</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled>
          <Link href="/help" className="space-x-1">
            <CircleHelp style={{ height: 18, width: 18 }} />
            <span>Help Center</span>
          </Link>
        </DropdownMenuItem>
        {!user.agency && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/start-renting"
                className="flex-col items-start leading-5"
              >
                <span className="font-bold">Become host</span>
                <span>
                  It&apos;s easy to start hosting and earn extra income
                </span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem className="text-center" asChild>
          <ModeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signout}
          className="space-x-1 text-destructive focus:text-destructive font-bold"
        >
          <DoorOpen
            style={{ height: 18, width: 18 }}
            className="text-destructive"
          />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
