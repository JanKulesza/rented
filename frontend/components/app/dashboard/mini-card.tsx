"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  image: string;
  label: string;
  info: string;
  href: string;
}

const MiniCard = ({ image, label, info, href }: Props) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-5">
        <div className="relative h-12 w-12 flex-shrink-0">
          <Image
            className="rounded-full object-fit"
            src={image}
            alt="Agent"
            fill
          />
        </div>
        <div className="flex flex-col overflow-x-hidden text-nowrap">
          <span>{label}</span>
          <span className="text-sm text-gray-500 font-light">{info}</span>
        </div>
      </div>

      <Button variant="ghost" size="icon" asChild>
        <Link href={href} className="group">
          <ArrowRight
            size={20}
            className="text-gray-400 group-hover:text-gray-600 transition-colors duration-150"
          />
        </Link>
      </Button>
    </div>
  );
};

export default MiniCard;
