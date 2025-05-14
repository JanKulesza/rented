"use client";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { ReactNode } from "react";

interface Props {
  item: {
    title: string;
    url: string;
    icon: ReactNode;
  };
}

const SidebarButton = ({ item }: Props) => {
  const isActive = usePathname() === item.url;

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        className={`h-10 hover:bg-primary hover:text-white ${
          isActive ? "bg-primary text-white" : ""
        }`}
        asChild
      >
        <a href={item.url}>
          {item.icon}
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarButton;
