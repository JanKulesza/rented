"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ReactNode } from "react";

export default function BackButton({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <Button variant="ghost" className="text-lg" onClick={router.back}>
      {children}
    </Button>
  );
}
