import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const useMap = () =>
  useMemo(
    () =>
      dynamic(() => import("@/components/elements/map/map"), {
        loading: () => <Skeleton />,
        ssr: false,
      }),
    []
  );
export default useMap;
