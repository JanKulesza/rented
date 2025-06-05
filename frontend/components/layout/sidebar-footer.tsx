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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronsUpDown, User2 } from "lucide-react";
import { agencyContext } from "../providers/agency-provider";

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
            <DropdownMenuContent side="top">
              <DropdownMenuItem>Agency details</DropdownMenuItem>
              <DropdownMenuItem disabled>Billing</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default SidebarAgencyFooter;
