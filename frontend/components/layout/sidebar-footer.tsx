"use client";
import React, { useContext } from "react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Building2,
  ChevronsUpDown,
  Coins,
  SquarePen,
  Trash2,
  User2,
} from "lucide-react";
import { agencyContext } from "../providers/agency-provider";
import DeleteAgency from "../app/details/delete-agency";
import EditAgency from "../app/details/edit-agency";
import Link from "next/link";

const SidebarAgencyFooter = () => {
  const { state } = useSidebar();
  const { agency } = useContext(agencyContext);
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="cursor-pointer hover:bg-primary hover:text-white"
              >
                {state === "collapsed" ? (
                  <ChevronsUpDown className="mx-auto" />
                ) : (
                  <>
                    <User2 /> <span>{agency.name}</span>
                    <ChevronsUpDown className="ml-auto" />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="bg-sidebar w-60">
              <DropdownMenuItem asChild>
                <Link href={`/app/${agency._id}/details`}>
                  <Building2 /> Agency details
                </Link>
              </DropdownMenuItem>
              <EditAgency>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <SquarePen /> Edit agency
                </DropdownMenuItem>
              </EditAgency>
              <DeleteAgency agencyId={agency._id}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  variant="destructive"
                >
                  <Trash2 /> Delete agency
                </DropdownMenuItem>
              </DeleteAgency>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Coins /> Billing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default SidebarAgencyFooter;
