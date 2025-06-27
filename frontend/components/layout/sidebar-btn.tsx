"use client";
import { useParams, usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  item: {
    title: string;
    url: string;
    icon: ReactNode;
    disabled?: boolean;
  };
}

const SidebarButton = ({ item }: Props) => {
  const pathname = usePathname();
  const { agencyId } = useParams();
  const isActive =
    item.url === pathname ||
    (item.url !== `/app/${agencyId}` && pathname.startsWith(item.url));

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        className={`h-10 hover:bg-primary hover:text-white ${
          isActive ? "bg-primary text-white" : ""
        }`}
        asChild
      >
        <Link href={item.url} aria-disabled={item.disabled}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarButton;
