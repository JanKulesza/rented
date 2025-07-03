"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const ShowError = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      setTimeout(() => toast.error(error), 1000);
    }
  }, [error]);

  return null;
};

export default ShowError;
